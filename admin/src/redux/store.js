import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from './slices/authAdminSlice';
import categoryReducer from './slices/categorySlice';

export const store = configureStore({
   reducer: {
      authAdmin: adminAuthReducer,
      category: categoryReducer
   },
})