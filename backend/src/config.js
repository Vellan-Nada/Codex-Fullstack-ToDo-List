import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    jwtSecret: process.env.SUPABASE_JWT_SECRET,
    tasksTable: process.env.SUPABASE_TASKS_TABLE || 'tasks',
    profilesTable: process.env.SUPABASE_PROFILES_TABLE || 'profiles'
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    priceId: process.env.STRIPE_PRICE_ID,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },
  limits: {
    free: Number(process.env.FREE_PLAN_LIMIT || 4),
    premium: Number(process.env.PREMIUM_PLAN_LIMIT || 20)
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};
