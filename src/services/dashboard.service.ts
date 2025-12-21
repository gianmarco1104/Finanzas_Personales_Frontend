import api from './api';
import type { DashboardResponse } from '../types/dashboard.types';

export const getDashboardMetrics = async (): Promise<DashboardResponse> => {
  const response = await api.get<DashboardResponse>('/transactions/dashboard');
  return response.data;
};
