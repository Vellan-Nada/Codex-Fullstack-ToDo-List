import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { upsertProfile, getProfile } from '../services/profileService.js';
import { createCheckoutSession } from '../services/stripeService.js';
import { config } from '../config.js';

const router = Router();

const planSchema = z.object({
  plan: z.enum(['free', 'premium'])
});

const checkoutSchema = z.object({
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
});

router.use(requireAuth);

router.post('/plan', async (req, res, next) => {
  try {
    const { plan } = planSchema.parse(req.body);
    const profile = await upsertProfile(req.user.id, { plan });
    res.json({ plan: profile.plan });
  } catch (error) {
    next(error);
  }
});

router.post('/checkout', async (req, res, next) => {
  try {
    const { successUrl, cancelUrl } = checkoutSchema.parse(req.body || {});
    const profile = await getProfile(req.user.id);
    if (profile.plan === 'premium') {
      return res.status(200).json({ message: 'Already premium' });
    }
    const session = await createCheckoutSession({
      userId: req.user.id,
      email: req.user.email,
      successUrl: successUrl || `${config.frontendUrl}/dashboard`,
      cancelUrl: cancelUrl || `${config.frontendUrl}/upgrade`
    });

    // Provide both options for the frontend to handle redirect
    res.json({
      sessionId: session.id,
      checkoutUrl: session.url
    });
  } catch (error) {
    next(error);
  }
});

export default router;
