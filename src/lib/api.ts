import axios from 'axios';
import type { Campaign, KpiData } from '../data/mockData';

const api = axios.create({
  baseURL: '/api',
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dashads-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const { success, data, message } = response.data;
    if (success) return data;
    throw new Error(message || 'Error en la petición');
  },
  (error) => {
    const apiError = error.response?.data?.message || error.message || 'Error de conexión';
    return Promise.reject(new Error(apiError));
  }
);

export const fetchKpis = (platform?: string): Promise<KpiData> => 
  api.get('/ads/kpis', { params: { platform } });

export const fetchCampaigns = (platform?: string): Promise<Campaign[]> => 
  api.get('/ads/campaigns', { params: { platform } });

export const syncAds = () => api.post('/ads/sync');

export const analyzeCampaign = (name: string, metrics: any) => 
  api.post('/ai/analyze', { name, metrics });

export interface AiConfig {
  provider: string;
  apiKey?: string;
  modelName?: string;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'USER';
  permissions: string[];
  skin: string;
}

export const fetchAiConfig = (): Promise<AiConfig> => api.get('/config/ai');

export const updateAiConfig = (config: Partial<AiConfig>): Promise<AiConfig> => 
  api.post('/config/ai', config);

// User Management
export const getUsers = (): Promise<User[]> => api.get('/users');

export const createUser = (userData: Partial<User> & { password?: string }): Promise<User> => 
  api.post('/users', userData);

export const updateUser = (id: string, userData: Partial<User> & { password?: string }): Promise<User> => 
  api.put(`/users/${id}`, userData);

export const deleteUser = (id: string): Promise<any> => api.delete(`/users/${id}`);

// Company & Accounts
export const getCompanyDetails = (id: string): Promise<any> => api.get(`/companies/${id}`);

export const deleteAccount = (id: string): Promise<any> => api.delete(`/companies/accounts/${id}`);

// Auth Security
export const changePassword = (data: { currentPassword?: string, newPassword: string }): Promise<any> => 
  api.post('/auth/change-password', data);

export default api;
