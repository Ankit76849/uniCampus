import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('student');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/update-profile', data),
};

export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
};

export const attendanceAPI = {
  get: () => API.get('/attendance'),
};

export const timetableAPI = {
  get: () => API.get('/timetable'),
};

export const resultsAPI = {
  get: () => API.get('/results'),
};

export const examAPI = {
  getSchedule: () => API.get('/exam-schedule'),
  getRegistration: () => API.get('/exam-registration'),
  submitRegistration: (data) => API.post('/exam-registration', data),
};

export const libraryAPI = {
  get: () => API.get('/library'),
};

export const hostelAPI = {
  getLeaves: () => API.get('/leaves'),
  applyLeave: (data) => API.post('/leaves', data),
};

export const duesAPI = {
  get: () => API.get('/dues'),
};

export const canteenAPI = {
  get: () => API.get('/canteen'),
  save: (data) => API.post('/canteen', data),
};

export const feedbackAPI = {
  get: () => API.get('/feedback'),
  submit: (data) => API.post('/feedback', data),
};

export const notificationsAPI = {
  get: () => API.get('/notifications'),
  markRead: (id) => API.put(`/notifications/${id}/read`),
};

export const eventsAPI = {
  get: () => API.get('/events'),
};

export const resourcesAPI = {
  get: (params) => API.get('/resources', { params }),
};

export const documentsAPI = {
  get: () => API.get('/documents'),
  upload: (data) => API.post('/documents', data),
  delete: (docId) => API.delete(`/documents/${docId}`),
};

export const inboxAPI = {
  get: () => API.get('/inbox'),
  markRead: (id) => API.put(`/inbox/${id}/read`),
};

export const holidaysAPI = {
  get: () => API.get('/holidays'),
};

export const practiceSchoolAPI = {
  get: () => API.get('/practice-school'),
};

export default API;
