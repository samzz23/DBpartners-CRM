import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Client API
export const clientAPI = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
};

// Accounting API
export const invoiceAPI = {
  getAll: () => api.get('/accounting/invoices'),
  getById: (id) => api.get(`/accounting/invoices/${id}`),
  create: (data) => api.post('/accounting/invoices', data),
  update: (id, data) => api.put(`/accounting/invoices/${id}`, data),
  delete: (id) => api.delete(`/accounting/invoices/${id}`),
};

export const paymentAPI = {
  getAll: () => api.get('/accounting/payments'),
  getById: (id) => api.get(`/accounting/payments/${id}`),
  create: (data) => api.post('/accounting/payments', data),
};

export const expenseAPI = {
  getAll: () => api.get('/accounting/expenses'),
  getById: (id) => api.get(`/accounting/expenses/${id}`),
  create: (data) => api.post('/accounting/expenses', data),
  update: (id, data) => api.put(`/accounting/expenses/${id}`, data),
  delete: (id) => api.delete(`/accounting/expenses/${id}`),
};

// Campaign API
export const campaignAPI = {
  getAll: () => api.get('/campaigns'),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns', data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
};

export const metricAPI = {
  getAll: (campaignId) => api.get('/campaigns/metrics', { params: { campaign_id: campaignId } }),
  getById: (id) => api.get(`/campaigns/metrics/${id}`),
  create: (data) => api.post('/campaigns/metrics', data),
};

export const reportAPI = {
  getAll: (campaignId) => api.get('/campaigns/reports', { params: { campaign_id: campaignId } }),
  getById: (id) => api.get(`/campaigns/reports/${id}`),
  ingest: (data) => api.post('/campaigns/reports', data),
};

export default api;
