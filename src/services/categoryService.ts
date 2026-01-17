import api from './api';
import { Kategori } from '../types/category';

export const getKategori = async (): Promise<Kategori[]> => {
  const res = await api.get('/api/kategori');
  // ✅ Sort by id_kategori descending
  return res.data.sort(
    (a: Kategori, b: Kategori) => b.id_kategori - a.id_kategori,
  );
};

export const createKategori = async (payload: { nama_kategori: string }) => {
  const res = await api.post('/api/kategori', payload);
  return res.data;
};

export const updateKategori = async (
  id: number,
  payload: { nama_kategori: string },
) => {
  const res = await api.put(`/api/kategori/${id}`, payload);
  return res.data;
};

export const deleteKategori = async (id: number) => {
  const res = await api.delete(`/api/kategori/${id}`);
  return res.data;
};
