import { Router } from 'express';
import authRoutes from './auth.js';
import taskRoutes from './tasks.js';
import billingRoutes from './billing.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/billing', billingRoutes);

export default router;
