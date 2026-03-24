import axios from 'axios';
import type { Campaign, KpiData } from '../data/mockData';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3001/api',
});

// Interceptor to handle standardized response structure
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

export const fetchAiConfig = (): Promise<AiConfig> => api.get('/config/ai');

export const updateAiConfig = (config: Partial<AiConfig>): Promise<AiConfig> => 
  api.post('/config/ai', config);

export default api;
