import api from './api';
import type {
  UserProfileResponse,
  UpdateProfileRequest,
  ChangeEmailRequest,
  ChangePasswordRequest,
} from '../types/user.types';

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const { data } = await api.get<UserProfileResponse>('/user/profile');
  return data;
};

export const updateUserProfile = async (payload: UpdateProfileRequest): Promise<void> => {
  await api.put('/user/update', payload);
};

export const requestEmailChange = async (payload: ChangeEmailRequest): Promise<void> => {
  await api.patch('user/update/email', payload);
};

export const requestPasswordChange = async (payload: ChangePasswordRequest): Promise<void> => {
  await api.patch('user/update/password', payload);
};
