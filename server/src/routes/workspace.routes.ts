import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
    createWorkspace, getWorkspaces, getWorkspaceById,
    createProject, getProjects,
    createTask, getTasks, updateTask, deleteTask,
} from '../controllers/workspace.controller';

const router = Router();

// Workspaces
router.post('/', protect, createWorkspace);
router.get('/', protect, getWorkspaces);
router.get('/:id', protect, getWorkspaceById);

// Projects (nested under workspace)
router.post('/:workspaceId/projects', protect, createProject);
router.get('/:workspaceId/projects', protect, getProjects);

// Tasks (nested under project)
router.post('/projects/:projectId/tasks', protect, createTask);
router.get('/projects/:projectId/tasks', protect, getTasks);
router.patch('/tasks/:id', protect, updateTask);
router.delete('/tasks/:id', protect, deleteTask);

export default router;
