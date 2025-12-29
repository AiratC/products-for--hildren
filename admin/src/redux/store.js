import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from './slices/authAdminSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';

export const store = configureStore({
   reducer: {
      authAdmin: adminAuthReducer,
      category: categoryReducer,
      product: productReducer
   },
})