import { config } from '../config.js';

export const PLAN_LIMITS = {
  free: config.limits.free,
  premium: config.limits.premium
};

export const clampPlan = (plan) => (plan === 'premium' ? 'premium' : 'free');

export const getLimitForPlan = (plan) => PLAN_LIMITS[clampPlan(plan)] ?? PLAN_LIMITS.free;
