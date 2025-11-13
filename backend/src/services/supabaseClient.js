import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  console.warn('[supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. API routes will fail until configured.');
}

export const supabaseAdmin = config.supabase.url && config.supabase.serviceRoleKey
  ? createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: {
        persistSession: false
      }
    })
  : null;

export const ensureSupabase = () => {
  if (!supabaseAdmin) {
    const error = new Error('Supabase admin client is not configured');
    error.status = 500;
    throw error;
  }
  return supabaseAdmin;
};
