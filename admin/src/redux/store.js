import { configureStore } from '@reduxjs/toolkit'
import adminAuthReducer from './slices/authAdminSlice'


export const store = configureStore({
   reducer: {
      authAdmin: adminAuthReducer
   },
})