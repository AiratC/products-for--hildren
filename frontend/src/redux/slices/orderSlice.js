import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchAxios from "../../utils/fetchAxios";
import { clearCart } from "./cartSlice";



export const createOrder = createAsyncThunk(
   'orders/createOrder',
   async (orderData, { dispatch, rejectWithValue }) => {
      console.log(orderData)
      try {
         // const response = await fetchAxios.post(`/api/orders/create-order`, orderData);

         // if(response.status === 201 || response.status === 200) {
         //    dispatch(clearCart());
         //    return response.data;
         // }
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
)


const initialState = {
   loading: false,
   order: null,
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
            state.order = action.payload;
         })
         .addCase(createOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
   }
});


export default orderSlice.reducer;