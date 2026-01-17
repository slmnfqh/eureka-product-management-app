import api from './api';
import { Product } from '../types/product';

export const getProduk = async (): Promise<Product[]> => {
  const res = await api.get('/api/produk');
  /// ✅ Sort by tgl_register descending dengan null safety
  return res.data.sort((a: Product, b: Product) => {
    // Handle undefined/null dates
    const dateA = a.tgl_register ? new Date(a.tgl_register).getTime() : 0;
    const dateB = b.tgl_register ? new Date(b.tgl_register).getTime() : 0;

    if (dateB !== dateA) {
      return dateB - dateA; // Sort by date descending
    }
    return b.id_produk - a.id_produk; // If same date, sort by ID descending
  });
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
