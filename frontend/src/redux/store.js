import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './slices/authUserSlice.js';
import favoriteReducer from './slices/favoriteSlice.js';
import cartReducer from './slices/cartSlice.js';
import orderReducer from './slices/orderSlice.js';

export const store = configureStore({
   reducer: {
      authUser: authUserReducer,
      favorites: favoriteReducer,
      cart: cartReducer,
      order: orderReducer
   },
})