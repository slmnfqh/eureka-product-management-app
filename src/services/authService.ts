import { LoginPayload, LoginResponse, RegisterPayload } from '../types/auth';
import api from './api';

export const loginService = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const res = await api.post('/api/auth/login', payload);
  console.log(`res-Nya: ${JSON.stringify(res.data)}`);
  return res.data;
};

export const registerService = async (
  payload: RegisterPayload,
): Promise<void> => {
  await api.post('/api/auth/register', payload);
};

export const logoutService = async () => {
  await api.post('/api/auth/logout');
};
