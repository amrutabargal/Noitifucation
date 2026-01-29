import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Set up axios defaults
axios.defaults.baseURL = API_URL;
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Auth API
export const authAPI = {
  login: (email, password) => axios.post('/auth/login', { email, password }),
  register: (name, email, password) => axios.post('/auth/register', { name, email, password }),
  getMe: () => axios.get('/auth/me'),
  logout: () => axios.post('/auth/logout'),
  forgotPassword: (email) => axios.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => axios.post('/auth/reset-password', { token, password }),
  googleLogin: () => {
    window.location.href = `${API_URL}/auth/google`;
  }
};

// Projects API
export const projectsAPI = {
  getAll: () => axios.get('/projects'),
  getById: (id) => axios.get(`/projects/${id}`),
  create: (data) => axios.post('/projects', data),
  update: (id, data) => axios.put(`/projects/${id}`, data),
  delete: (id) => axios.delete(`/projects/${id}`)
};

// Subscribers API
export const subscribersAPI = {
  getByProject: (projectId) => axios.get(`/subscribers/project/${projectId}`),
  subscribe: (data) => axios.post('/subscribers/subscribe', data),
  unsubscribe: (data) => axios.post('/subscribers/unsubscribe', data),
  getStats: (projectId) => axios.get(`/subscribers/stats/${projectId}`)
};

// Notifications API
export const notificationsAPI = {
  getByProject: (projectId) => axios.get(`/notifications/project/${projectId}`),
  getById: (id) => axios.get(`/notifications/${id}`),
  create: (data) => axios.post('/notifications', data),
  update: (id, data) => axios.put(`/notifications/${id}`, data),
  delete: (id) => axios.delete(`/notifications/${id}`),
  send: (id) => axios.post(`/notifications/${id}/send`)
};

// Analytics API
export const analyticsAPI = {
  getByProject: (projectId) => axios.get(`/analytics/project/${projectId}`),
  export: (projectId) => axios.get(`/analytics/export/${projectId}`, { responseType: 'blob' })
};

// Events API
export const eventsAPI = {
  track: (data) => axios.post('/events/track', data, {
    headers: { 'X-API-Key': data.apiKey }
  }),
  getByProject: (projectId) => axios.get(`/events/project/${projectId}`)
};

// Automations API
export const automationsAPI = {
  getByProject: (projectId) => axios.get(`/automations/project/${projectId}`),
  getById: (id) => axios.get(`/automations/${id}`),
  create: (data) => axios.post('/automations', data),
  update: (id, data) => axios.put(`/automations/${id}`, data),
  delete: (id) => axios.delete(`/automations/${id}`)
};

// Export subscribers
export const subscribersAPIExport = {
  export: (projectId) => axios.get(`/subscribers/export/${projectId}`, { responseType: 'blob' }),
  import: (projectId, data) => axios.post(`/subscribers/import/${projectId}`, data)
};

export default axios;

