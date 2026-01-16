import axios from 'axios';
import { getAuth } from '../utils/storage';

const api = axios.create({
  baseURL: 'https://test-kandidat.eurekagroup.id',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async config => {
  const auth = await getAuth();

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});

export default api;
