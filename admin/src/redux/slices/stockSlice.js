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
);

// ! Удалени акции
export const deleteStock = createAsyncThunk(
   'stock/deleteStock',
   async (stockId, {rejectWithValue}) => {
      try {
         const response = await fetchAxios.delete(`/api/stock/delete-stock/${stockId}`);
         return {stockId, ...response.data};
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
)

// ! Получение всех акций
export const getAllStocks = createAsyncThunk(
   'stock/getAllStock',
   async (_, { rejectWithValue }) => {
      try {
         const response = await fetchAxios.get(`/api/stock/get-all-stocks`);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response.data);
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
         state.stocks.unshift(action.payload.data);
         message.success(action.payload.message || 'Усаешное добавление акции')
      })
      .addCase(addStock.rejected, (state, action) => {
         state.loading = false;
         message.error(action.payload.error || 'Ошибка при создании акции')
      })
      // ! Получаем все акции
      .addCase(getAllStocks.pending, (state) => {
         state.loading = true;
      })
      .addCase(getAllStocks.fulfilled, (state, action) => {
         state.loading = false;
         state.stocks = action.payload.stocks;
      })
      .addCase(getAllStocks.rejected, (state, action) => {
         state.loading = false;
         message.error(action.payload.error || 'Ошибка при создании акции')
      })
      // ! Удаляем акцию
      .addCase(deleteStock.pending, (state) => {
         state.loading = true;
      })
      .addCase(deleteStock.fulfilled, (state, action) => {
         state.loading = false;
         state.stocks = state.stocks.filter(stock => stock.stock_id !== action.payload.stockId)
         message.success(action.payload.message)
      })
      .addCase(deleteStock.rejected, (state, action) => {
         state.loading = false;
         message.error(action.payload.error || 'Ошибка при удалении акции')
      })
   }
});


export const { clearStockState } = stockSlice.actions;

export default stockSlice.reducer;
