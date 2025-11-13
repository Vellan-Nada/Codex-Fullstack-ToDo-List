import { localStore } from './localStore.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const hasRemoteApi = Boolean(API_BASE_URL);

const withBase = (path) => `${API_BASE_URL}${path}`;

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
});

const request = async (path, options = {}) => {
  if (!hasRemoteApi) {
    throw new Error('API base URL is not configured');
  }

  const response = await fetch(withBase(path), options);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Request failed');
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

export const apiClient = {
  async fetchProfile({ token, userId }) {
    if (hasRemoteApi && token) {
      return request('/auth/profile', {
        method: 'GET',
        headers: getHeaders(token)
      });
    }
    return localStore.getProfile(userId);
  },
  async updatePlan({ token, plan, userId }) {
    if (hasRemoteApi && token) {
      return request('/billing/plan', {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ plan })
      });
    }
    return localStore.updatePlan(userId, plan);
  },
  async listTasks({ token, userId }) {
    if (hasRemoteApi && token) {
      return request('/tasks', {
        method: 'GET',
        headers: getHeaders(token)
      });
    }
    return localStore.listTasks(userId);
  },
  async createTask({ token, payload, userId }) {
    if (hasRemoteApi && token) {
      return request('/tasks', {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(payload)
      });
    }
    return localStore.createTask(userId, payload);
  },
  async updateTask({ token, taskId, payload, userId }) {
    if (hasRemoteApi && token) {
      return request(`/tasks/${taskId}`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify(payload)
      });
    }
    return localStore.updateTask(userId, taskId, payload);
  },
  async deleteTask({ token, taskId, userId }) {
    if (hasRemoteApi && token) {
      return request(`/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getHeaders(token)
      });
    }
    return localStore.deleteTask(userId, taskId);
  },
  async startCheckout({ token, successUrl, cancelUrl }) {
    if (!hasRemoteApi || !token) {
      throw new Error('Stripe checkout requires the backend API');
    }
    return request('/billing/checkout', {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ successUrl, cancelUrl })
    });
  }
};
