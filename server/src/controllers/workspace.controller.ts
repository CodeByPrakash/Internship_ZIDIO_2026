import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

// ─── WORKSPACE ───────────────────────────────────────────────────────────────

export const createWorkspace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const { name, description } = req.body;
        const workspace = await prisma.workspace.create({
            data: {
                name,
                description,
                ownerId: req.user.userId,
                members: {
                    create: {
                        userId: req.user.userId,
                        role: 'owner',
                    },
                },
            },
            include: {
                owner: { select: { id: true, name: true, avatar: true } },
                members: { include: { user: { select: { id: true, name: true, avatar: true } } } },
            },
        });
        res.status(201).json({ success: true, workspace });
    } catch (err) { next(err); }
};

export const getWorkspaces = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const workspaces = await prisma.workspace.findMany({
            where: {
                OR: [
                    { ownerId: req.user.userId },
                    { members: { some: { userId: req.user.userId } } },
                ],
            },
            include: {
                owner: { select: { id: true, name: true, avatar: true } },
                members: { include: { user: { select: { id: true, name: true, avatar: true } } } },
                projects: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ success: true, workspaces });
    } catch (err) { next(err); }
};

export const getWorkspaceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const workspace = await prisma.workspace.findUnique({
            where: { id: req.params.id },
            include: {
                owner: { select: { id: true, name: true, avatar: true } },
                members: { include: { user: { select: { id: true, name: true, avatar: true, email: true } } } },
                projects: { include: { tasks: true } },
            },
        });
        if (!workspace) { res.status(404).json({ success: false, message: 'Workspace not found' }); return; }
        res.status(200).json({ success: true, workspace });
    } catch (err) { next(err); }
};

// ─── PROJECT ─────────────────────────────────────────────────────────────────

export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { workspaceId, name, description } = req.body;
        const project = await prisma.project.create({
            data: {
                workspaceId,
                name,
                description,
            },
        });
        res.status(201).json({ success: true, project });
    } catch (err) { next(err); }
};

export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const projects = await prisma.project.findMany({
            where: { workspaceId: req.params.workspaceId },
            include: { tasks: true },
        });
        res.status(200).json({ success: true, projects });
    } catch (err) { next(err); }
};

// ─── TASK ────────────────────────────────────────────────────────────────────

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { projectId, title, description, priority, column, status, assigneeId, dueDate, meetingId } = req.body;
        const task = await prisma.task.create({
            data: {
                projectId,
                title,
                description,
                priority: priority || 'medium',
                column: column || 'todo',
                status: status || 'todo',
                assigneeId,
                dueDate,
                meetingId,
            },
            include: {
                assignee: { select: { id: true, name: true, avatar: true } },
            },
        });
        res.status(201).json({ success: true, task });
    } catch (err) { next(err); }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const tasks = await prisma.task.findMany({
            where: req.params.projectId ? { projectId: req.params.projectId } : undefined,
            include: {
                assignee: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ success: true, tasks });
    } catch (err) { next(err); }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const task = await prisma.task.update({
            where: { id: req.params.id },
            data: req.body,
            include: {
                assignee: { select: { id: true, name: true, avatar: true } },
            },
        });
        res.status(200).json({ success: true, task });
    } catch (err) { next(err); }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await prisma.task.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: 'Task deleted' });
    } catch (err) { next(err); }
};
