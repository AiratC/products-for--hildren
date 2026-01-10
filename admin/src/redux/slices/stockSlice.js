import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAxios } from "../../utils/fetchAxios";
import { message } from "antd";

// ! Добавляем акцию
export const addStock = createAsyncThunk(
   'stock/addStock',
   async (formData, { rejectWithValue }) => {
      try {
         const response = await fetchAxios.post(`/api/stock/add-stock`, formData);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
)

const initialState = {
   stocks: [],
   loading: false,
   success: false,
   error: false
};

const stockSlice = createSlice({
   name: 'stock',
   initialState,
   reducers: {
      // Очистка состояния
      clearStockState: (state) => {
         state.success = false;
         state.error = false;
      }
   },
   extraReducers: (builder) => {
      builder
      // ! Добавляем акцию
      .addCase(addStock.pending, (state) => {
         state.loading = true;
      })
      .addCase(addStock.fulfilled, (state, action) => {
         state.loading = false;
         message.success(action.payload.message || 'Усаешное добавление акции')
      })
      .addCase(addStock.rejected, (state, action) => {
         state.loading = false;
         message.error(action.payload.error || 'Ошибка при создании акции')
      })
   }
});


export const { clearStockState } = stockSlice.actions;

export default stockSlice.reducer;
