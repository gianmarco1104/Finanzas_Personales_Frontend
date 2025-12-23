import api from './api';
import type { RegisterRequest } from '../types/register.types';

export const registerUser = async (payload: RegisterRequest): Promise<void> => {
  await api.post('/user/register', payload);
};
