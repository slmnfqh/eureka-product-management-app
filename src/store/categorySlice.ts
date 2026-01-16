import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Kategori } from '../types/category';

interface CategoryState {
  items: Kategori[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    fetchCategoryStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCategorySuccess(state, action: PayloadAction<Kategori[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchCategoryError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchCategoryStart, fetchCategorySuccess, fetchCategoryError } =
  categorySlice.actions;

export default categorySlice.reducer;
