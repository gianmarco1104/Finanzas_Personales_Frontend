import api from './api';
import type { UserProfileResponse, UpdateProfileRequest } from '../types/user.types';

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const { data } = await api.get<UserProfileResponse>('/user/profile');
  return data;
};

export const updateUserProfile = async (payload: UpdateProfileRequest): Promise<void> => {
  await api.put('/user/update', payload);
};

// Stubs para las funciones especiales (luego me pasas los endpoints reales)
export const requestEmailChange = async () => {
  console.log('Solicitando cambio de email...');
};

export const requestPasswordChange = async () => {
  console.log('Solicitando cambio de contraseña...');
};
