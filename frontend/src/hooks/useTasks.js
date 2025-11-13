import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../lib/apiClient.js';
import { PLAN_LIMITS } from '../lib/constants.js';

export function useTasks({ plan = 'free', session, user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingAction, setPendingAction] = useState(false);

  const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
  const remaining = Math.max(limit - tasks.length, 0);
  const accessToken = session?.access_token;
  const userId = user?.id;

  const hydrate = useCallback(async () => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const nextTasks = await apiClient.listTasks({ token: accessToken, userId });
      setTasks(Array.isArray(nextTasks) ? nextTasks : []);
      setError(null);
    } catch (err) {
      console.error('[useTasks] listTasks failed', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken, userId]);

  useEffect(() => {
    hydrate();
  }, [hydrate, plan]);

  const canCreate = useMemo(() => remaining > 0, [remaining]);

  const createTask = async (payload) => {
    if (!canCreate) {
      throw new Error('Task limit reached. Upgrade to add more tasks.');
    }
    try {
      setPendingAction(true);
      const newTask = await apiClient.createTask({ token: accessToken, userId, payload });
      setTasks((current) => [newTask, ...current]);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setPendingAction(false);
    }
  };

  const updateTask = async (taskId, payload) => {
    try {
      setPendingAction(true);
      const updated = await apiClient.updateTask({ token: accessToken, userId, taskId, payload });
      setTasks((current) => current.map((task) => (task.id === taskId ? updated : task)));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingAction(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setPendingAction(true);
      await apiClient.deleteTask({ token: accessToken, userId, taskId });
      setTasks((current) => current.filter((task) => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingAction(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    pendingAction,
    createTask,
    updateTask,
    deleteTask,
    refresh: hydrate,
    limit,
    remaining
  };
}
