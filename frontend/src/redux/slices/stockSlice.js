import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchAxios from '../../utils/fetchAxios';

export const fetchStocks = createAsyncThunk(
   'stocks/fetchStocks',
   async (page, thunkAPI) => {
      try {
         const response = await fetchAxios.get(`/api/stock/get-stocks?page=${page}`);
         return response.data;
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
      }

   });

const stockSlice = createSlice({
   name: 'stocks',
   initialState: {
      items: [],
      totalPages: 1,
      currentPage: 1,
      loading: false
   },
   reducers: {
      setCurrentPage: (state, action) => {
         state.currentPage = action.payload;
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchStocks.pending, (state) => { state.loading = true; })
         .addCase(fetchStocks.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload.stocks;
            state.totalPages = action.payload.totalPages;
         })
         .addCase(fetchStocks.rejected, (state) => {
            state.loading = false;
         });
   }
});

export const { setCurrentPage } = stockSlice.actions;
export default stockSlice.reducer;