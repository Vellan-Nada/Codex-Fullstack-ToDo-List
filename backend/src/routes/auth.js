import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getProfile } from '../services/profileService.js';
import { countTasks } from '../services/taskService.js';
import { getLimitForPlan } from '../utils/plan.js';

const router = Router();

router.use(requireAuth);

router.get('/profile', async (req, res, next) => {
  try {
    const profile = await getProfile(req.user.id);
    const tasksUsed = await countTasks(req.user.id);
    res.json({
      userId: req.user.id,
      email: req.user.email,
      plan: profile.plan,
      limit: getLimitForPlan(profile.plan),
      tasksUsed
    });
  } catch (error) {
    next(error);
  }
});

export default router;
