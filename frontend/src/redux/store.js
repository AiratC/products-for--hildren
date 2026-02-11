import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './slices/authUserSlice.js'
import favoriteReducer from './slices/favoriteSlice.js'


export const store = configureStore({
   reducer: {
      authUser: authUserReducer,
      favorites: favoriteReducer
   },
})