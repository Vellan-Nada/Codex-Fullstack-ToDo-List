import { ensureSupabase } from './supabaseClient.js';
import { config } from '../config.js';

const table = config.supabase.profilesTable;

export async function getProfile(userId) {
  const supabase = ensureSupabase();
  const { data, error } = await supabase.from(table).select('*').eq('user_id', userId).maybeSingle();
  if (error) {
    throw new Error(`Failed to load profile: ${error.message}`);
  }
  if (!data) {
    return { user_id: userId, plan: 'free' };
  }
  return data;
}

export async function upsertProfile(userId, payload) {
  const supabase = ensureSupabase();
  const { data, error } = await supabase
    .from(table)
    .upsert({ user_id: userId, ...payload }, { onConflict: 'user_id' })
    .select()
    .single();
  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }
  return data;
}
