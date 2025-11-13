const STORAGE_KEY = 'taskforge-local';

const getInitialState = () => ({ profiles: {}, tasks: {} });

const safeWindow = typeof window !== 'undefined' ? window : null;

const readStore = () => {
  if (!safeWindow) return getInitialState();
  try {
    const raw = safeWindow.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getInitialState();
  } catch (error) {
    console.error('[localStore] failed to parse store', error);
    return getInitialState();
  }
};

const writeStore = (nextState) => {
  if (!safeWindow) return;
  safeWindow.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
};

const getCrypto = () => {
  if (typeof self !== 'undefined' && self.crypto) return self.crypto;
  if (typeof globalThis !== 'undefined' && globalThis.crypto) return globalThis.crypto;
  return null;
};

const uuid = () => {
  const cryptoInstance = getCrypto();
  if (cryptoInstance?.randomUUID) {
    return cryptoInstance.randomUUID();
  }
  return Math.random().toString(16).slice(2);
};

const withStore = (mutator) => {
  const state = readStore();
  const result = mutator(state);
  writeStore(state);
  return result;
};

export const localStore = {
  getProfile(userId) {
    if (!userId) return { plan: 'free', tasksUsed: 0 };
    const state = readStore();
    const profile = state.profiles[userId] || { plan: 'free' };
    const tasks = state.tasks[userId] || [];
    return { plan: profile.plan || 'free', tasksUsed: tasks.length };
  },
  updatePlan(userId, plan) {
    if (!userId) return { plan: 'free' };
    return withStore((state) => {
      state.profiles[userId] = { ...(state.profiles[userId] || {}), plan };
      return { plan };
    });
  },
  listTasks(userId) {
    if (!userId) return [];
    const state = readStore();
    return state.tasks[userId] || [];
  },
  createTask(userId, payload) {
    if (!userId) return null;
    return withStore((state) => {
      const tasks = state.tasks[userId] || [];
      const newTask = {
        id: uuid(),
        title: payload.title,
        notes: payload.notes || '',
        status: payload.status || 'todo',
        createdAt: new Date().toISOString()
      };
      state.tasks[userId] = [newTask, ...tasks];
      return newTask;
    });
  },
  updateTask(userId, taskId, changes) {
    if (!userId) return null;
    return withStore((state) => {
      const tasks = state.tasks[userId] || [];
      state.tasks[userId] = tasks.map((task) => (task.id === taskId ? { ...task, ...changes } : task));
      return state.tasks[userId].find((task) => task.id === taskId) || null;
    });
  },
  deleteTask(userId, taskId) {
    if (!userId) return null;
    return withStore((state) => {
      const tasks = state.tasks[userId] || [];
      state.tasks[userId] = tasks.filter((task) => task.id !== taskId);
      return true;
    });
  }
};
