import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchAxios from "../../utils/fetchAxios";


export const updateCartAction = createAsyncThunk(
   'cart/updateCartAction',
   async (value, thunkAPI) => {
      try {
         const response = await fetchAxios.post(`/api/cart/update-cart-item`, value);
         return response.data;
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data);
      }
   }
);

export const fetchCart = createAsyncThunk(
   'cart/fetchCart',
   async (_, thunkAPI) => {
      try {
         const response = await fetchAxios.get('/api/cart/fetch-cart');
         return response.data;
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
      }
   } 
)


const initialState = {
   cartItems: [],
   loadingId: null,
   isFetching: null
}

const cartSlice = createSlice({
   name: 'cart',
   initialState,
   reducers: {

   },
   extraReducers: (builder) => {
      builder
         .addCase(updateCartAction.pending, (state, action) => {
            state.loadingId = action.meta.arg.productId;
         })
         .addCase(updateCartAction.fulfilled, (state, action) => {
            state.loadingId = null;
            const { productId, quantity } = action.payload;
            // Если товар есть в корзине то получим его индекс иначе -1
            const index = state.cartItems.findIndex(i => i.product_id === productId);
            // Если кол-во = 0 то удаляем товар из корзины
            if (quantity === 0) {
               state.cartItems = state.cartItems.filter(i => i.product_id !== productId)
            }
            // Если индекс не равен -1 то товар найден и обновляем кол-во
            else if (index !== -1) {
               state.cartItems[index].quantity = quantity;
            }
            // Если это первый товар то добавляем в массив
            else {
               state.cartItems.push({ product_id: productId, quantity })
            }
         })
         .addCase(updateCartAction.rejected, (state) => {
            state.loadingId = null
         })
         // При перезагрузки страницы
         .addCase(fetchCart.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(fetchCart.fulfilled, (state, action) => {
            state.isFetching = false;
            console.log(action.payload)
            state.cartItems = action.payload?.cartItems || [];
         })
         .addCase(fetchCart.rejected, (state) => {
            state.isFetching = false;
         })
   }
});


export default cartSlice.reducer;