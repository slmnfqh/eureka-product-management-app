import api from './api';
import { Product } from '../types/product';

export const getProduk = async (): Promise<Product[]> => {
  const res = await api.get('/api/produk');
  return res.data;
};

export const createProduk = async (formData: FormData) => {
  const res = await api.post('/api/produk', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const updateProduk = async (id: number, formData: FormData) => {
  const res = await api.put(`/api/produk/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const deleteProduk = async (id: number) => {
  const res = await api.delete(`/api/produk/${id}`);
  return res.data;
};
