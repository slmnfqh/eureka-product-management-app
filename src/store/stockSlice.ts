import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Stock } from '../types/stock';

interface StockState {
  items: Stock[];
  loading: boolean;
  error: string | null;
}

const initialState: StockState = {
  items: [],
  loading: false,
  error: null,
};

const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    fetchStockStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchStockSuccess(state, action: PayloadAction<Stock[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchStockError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchStockStart, fetchStockSuccess, fetchStockError } =
  stockSlice.actions;

export default stockSlice.reducer;
