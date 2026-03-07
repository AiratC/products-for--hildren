import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchAxios from "../../utils/fetchAxios";
import { clearCart } from "./cartSlice";



export const createOrder = createAsyncThunk(
   'orders/createOrder',
   async (orderData, { dispatch, rejectWithValue }) => {
      try {
         const response = await fetchAxios.post(`/api/orders/create-order`, orderData);

         if(response.status === 201 || response.status === 200) {
            dispatch(clearCart());
            return response.data;
         }
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
);

// Получаем все заказы пользователя
export const getOrders = createAsyncThunk(
   'orders/getOrders',
   async (_, thunkAPI) => {
      try {
         const response = await fetchAxios.get('/api/orders/get-orders');
         return response.data;
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
      }
   }
)


const initialState = {
   loading: false,
   orders: null,
   error: null
};


const orderSlice = createSlice({
   name: 'orders',
   initialState,
   reducers: {

   },
   extraReducers: (builder) => {
      builder
         // Создаем заказ
         .addCase(createOrder.pending, (state) => {
            state.loading = true;
         })
         .addCase(createOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
         })
         .addCase(createOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
         // Получаем все заказы пользователя
         .addCase(getOrders.pending, (state) => {
            state.loading = true;
         })
         .addCase(getOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
         })
         .addCase(getOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
   }
});


export default orderSlice.reducer;