import api from './api';
import { Stock } from '../types/stock';

export const getStok = async (): Promise<Stock[]> => {
  const res = await api.get('/api/stok');
  // ✅ Sort by tgl_update descending dengan null safety
  // Jika tgl_update sama, sort by id_stok descending
  return res.data.sort((a: Stock, b: Stock) => {
    // ✅ Jika undefined, gunakan 0 (epoch time, akan di-sort ke bawah)
    const dateA = a.tgl_update ? new Date(a.tgl_update).getTime() : 0;
    const dateB = b.tgl_update ? new Date(b.tgl_update).getTime() : 0;

    if (dateB !== dateA) {
      return dateB - dateA; // Sort by date descending
    }
    return b.id_stok - a.id_stok; // If same date, sort by ID descending
  });
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
