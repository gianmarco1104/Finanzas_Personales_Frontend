import api from './api';
import type { LoginRequest, AuthResponse } from '../types/auth.types'; //Se tiene que especificar el tipo

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};
