import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Event Types API
export const eventTypesAPI = {
    getAll: () => api.get('/api/event-types'),
    getById: (id) => api.get(`/api/event-types/${id}`),
    getBySlug: (slug) => api.get(`/api/event-types/slug/${slug}`),
    create: (data) => api.post('/api/event-types', data),
    update: (id, data) => api.put(`/api/event-types/${id}`, data),
    delete: (id) => api.delete(`/api/event-types/${id}`),
};

// Availability API
export const availabilityAPI = {
    getTimezones: () => api.get('/api/availability/timezones'),
    get: () => api.get('/api/availability'),
    upsert: (data) => api.post('/api/availability', data),
};

export default api;
