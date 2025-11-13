import { ensureSupabase } from './supabaseClient.js';
import { config } from '../config.js';

const table = config.supabase.tasksTable;

export async function listTasks(userId) {
  const supabase = ensureSupabase();
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    throw new Error(`Failed to list tasks: ${error.message}`);
  }
  return data || [];
}

export async function countTasks(userId) {
  const supabase = ensureSupabase();
  const { error, count } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (error) {
    throw new Error(`Failed to count tasks: ${error.message}`);
  }
  return count || 0;
}

export async function createTask(userId, payload) {
  const supabase = ensureSupabase();
  const { data, error } = await supabase
    .from(table)
    .insert({
      user_id: userId,
      title: payload.title,
      notes: payload.notes || '',
      status: payload.status || 'todo'
    })
    .select()
    .single();
  if (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }
  return data;
}

export async function updateTask(userId, taskId, payload) {
  const supabase = ensureSupabase();
  const changes = {};
  if (payload.title !== undefined) changes.title = payload.title;
  if (payload.notes !== undefined) changes.notes = payload.notes;
  if (payload.status !== undefined) changes.status = payload.status;

  const { data, error } = await supabase.from(table).update(changes).eq('user_id', userId).eq('id', taskId).select().single();
  if (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }
  return data;
}

export async function deleteTask(userId, taskId) {
  const supabase = ensureSupabase();
  const { error } = await supabase.from(table).delete().eq('user_id', userId).eq('id', taskId);
  if (error) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }
  return true;
}
