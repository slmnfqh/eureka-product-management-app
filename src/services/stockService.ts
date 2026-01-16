import api from './api';
import { Stock } from '../types/stock';

export const getStok = async (): Promise<Stock[]> => {
  const res = await api.get('/api/stok');
  return res.data;
};

export const createStok = async (payload: {
  id_produk: number;
  jumlah_barang: number;
}) => {
  const res = await api.post('/api/stok', payload);
  return res.data;
};

export const updateStok = async (
  id: number,
  payload: {
    id_produk: number;
    jumlah_barang: number;
  },
) => {
  // Path parameter menggunakan id_stok
  const res = await api.put(`/api/stok/${id}`, payload);
  return res.data;
};

export const deleteStok = async (id: number) => {
  const res = await api.delete(`/api/stok/${id}`);
  return res.data;
};
