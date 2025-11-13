import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { createTask, deleteTask, listTasks, updateTask, countTasks } from '../services/taskService.js';
import { getProfile } from '../services/profileService.js';
import { getLimitForPlan } from '../utils/plan.js';

const router = Router();

const createTaskSchema = z.object({
  title: z.string().min(1).max(160),
  notes: z.string().max(1000).optional(),
  status: z.enum(['todo', 'done']).optional()
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(160).optional(),
  notes: z.string().max(1000).nullable().optional(),
  status: z.enum(['todo', 'done']).optional()
});

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const tasks = await listTasks(req.user.id);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = createTaskSchema.parse(req.body);
    const profile = await getProfile(req.user.id);
    const limit = getLimitForPlan(profile.plan);
    const taskCount = await countTasks(req.user.id);
    if (taskCount >= limit) {
      return res.status(403).json({ message: 'Task limit reached. Upgrade to add more tasks.' });
    }
    const task = await createTask(req.user.id, payload);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.put('/:taskId', async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const payload = updateTaskSchema.parse(req.body);
    const task = await updateTask(req.user.id, taskId, payload);
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete('/:taskId', async (req, res, next) => {
  try {
    const { taskId } = req.params;
    await deleteTask(req.user.id, taskId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
