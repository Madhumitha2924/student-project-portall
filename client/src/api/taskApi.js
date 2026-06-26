import axiosInstance from './axiosInstance';

export const taskApi = {
  getAll: ({ search = '', status = 'all', priority = 'all', sort = 'newest' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status !== 'all') params.set('status', status);
    if (priority !== 'all') params.set('priority', priority);
    if (sort) params.set('sort', sort);
    return axiosInstance.get(`/tasks?${params.toString()}`);
  },

  getStats: () => axiosInstance.get('/tasks/stats'),

  getById: (id) => axiosInstance.get(`/tasks/${id}`),

  create: (data) => axiosInstance.post('/tasks', data),

  update: (id, data) => axiosInstance.put(`/tasks/${id}`, data),

  delete: (id) => axiosInstance.delete(`/tasks/${id}`),
};
