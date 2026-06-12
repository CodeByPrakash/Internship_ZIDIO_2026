import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Workspace from '../models/Workspace';
import Project from '../models/Project';
import Task from '../models/Task';

// ─── WORKSPACE ───────────────────────────────────────────────────────────────

export const createWorkspace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const workspace = await Workspace.create({
            ...req.body,
            owner: req.user!.userId,
            members: [{ user: new mongoose.Types.ObjectId(req.user!.userId), role: 'owner' }],
        });
        res.status(201).json({ success: true, workspace });
    } catch (err) { next(err); }
};

export const getWorkspaces = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const workspaces = await Workspace.find({ 'members.user': req.user!.userId })
            .populate('owner', 'name avatar')
            .populate('members.user', 'name avatar');
        res.status(200).json({ success: true, workspaces });
    } catch (err) { next(err); }
};

export const getWorkspaceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const workspace = await Workspace.findById(req.params.id)
            .populate('owner', 'name avatar')
            .populate('members.user', 'name avatar email');
        if (!workspace) { res.status(404).json({ success: false, message: 'Workspace not found' }); return; }
        res.status(200).json({ success: true, workspace });
    } catch (err) { next(err); }
};

// ─── PROJECT ─────────────────────────────────────────────────────────────────

export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const project = await Project.create({
            ...req.body,
            columns: req.body.columns || [
                { name: 'To Do', order: 0 },
                { name: 'In Progress', order: 1 },
                { name: 'Review', order: 2 },
                { name: 'Done', order: 3 },
            ],
        });
        res.status(201).json({ success: true, project });
    } catch (err) { next(err); }
};

export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const projects = await Project.find({ workspace: req.params.workspaceId });
        res.status(200).json({ success: true, projects });
    } catch (err) { next(err); }
};

// ─── TASK ────────────────────────────────────────────────────────────────────

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const task = await Task.create({ ...req.body, reporter: req.user!.userId });
        res.status(201).json({ success: true, task });
    } catch (err) { next(err); }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignee', 'name avatar')
            .populate('reporter', 'name avatar')
            .sort({ column: 1, order: 1 });
        res.status(200).json({ success: true, tasks });
    } catch (err) { next(err); }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .populate('assignee', 'name avatar');
        if (!task) { res.status(404).json({ success: false, message: 'Task not found' }); return; }
        res.status(200).json({ success: true, task });
    } catch (err) { next(err); }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Task deleted' });
    } catch (err) { next(err); }
};
