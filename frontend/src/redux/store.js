import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './slices/authUserSlice.js'


export const store = configureStore({
   reducer: {
      authUser: authUserReducer
   },
})