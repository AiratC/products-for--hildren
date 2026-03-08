import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAxios } from '../../utils/fetchAxios';


export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => {
   const { data } = await fetchAxios.get('/api/orders/get-all-orders');
   return data;
});

const ordersSlice = createSlice({
   name: 'orders',
   initialState: { items: [], loading: false },
   extraReducers: (builder) => {
      builder
         .addCase(fetchOrders.pending, (state) => { state.loading = true; })
         .addCase(fetchOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
         });
   },
});

export default ordersSlice.reducer;