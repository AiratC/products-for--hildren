import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from './slices/authAdminSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import contactReducer from './slices/contactSlice';
import stockReducer from './slices/stockSlice'


export const store = configureStore({
   reducer: {
      authAdmin: adminAuthReducer,
      category: categoryReducer,
      product: productReducer,
      contact: contactReducer,
      stock: stockReducer
   },
})