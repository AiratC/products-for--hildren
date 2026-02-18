import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchAxios from './../../utils/fetchAxios';

export const toggleFavoriteAction = createAsyncThunk(
   'favorite/toggle',
   async (value, thunkAPI) => {
      try {
         const response = await fetchAxios.post('/api/favorites/toggle', value);
         return response.data; // Возвращает { isFavorite, productId }
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data);
      }
   }
);

export const fetchFavorites = createAsyncThunk(
   'favorites/fetchAll',
   async (_, thunkAPI) => {
      try {
         const response = await fetchAxios.get('/api/favorites/get-all-favorites');
         // Возвращаем только массив ID для удобства проверки .includes()
         return response.data.favoriteProducts.map(p => p.product_id);
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data);
      }
   }
);

export const fetchFullFavorites = createAsyncThunk(
   'favorites/fetchFullFavorites',
   async (_, thunkAPI) => {
      try {
         const response = await fetchAxios.get('/api/favorites/get-full-favorites');
         return response.data
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data);
      }
   }
);



const initialState = {
   items: [],
   loading: null,
   isFetching: null,
   fullItems: []
};

const favoriteSlice = createSlice({
   name: 'favorites',
   initialState,
   reducers: {
      clearFavorites: (state) => {
         state.items = []
      }
   },
   extraReducers: (builder) => {
      builder
         // Добавление и удалени избранного товара
         .addCase(toggleFavoriteAction.pending, (state, action) => {
            // action.meta.arg содержит данные, переданные в thunk при вызове
            state.loading = action.meta.arg.productId;
         })
         .addCase(toggleFavoriteAction.fulfilled, (state, action) => {
            state.loading = null; // Сбрасываем после успеха
            const { isFavorite, productId } = action.payload;
            if (isFavorite) {
               state.items.push(productId);
            } else {
               state.items = state.items.filter(id => id !== productId);
               state.fullItems = state.fullItems.filter(product => product.product_id !== productId)
            }
         })
         .addCase(toggleFavoriteAction.rejected, (state) => {
            state.loading = null; // Сбрасываем при ошибке
         })
         // При перезагрузки страницы
         .addCase(fetchFavorites.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(fetchFavorites.fulfilled, (state, action) => {
            state.isFetching = false;
            state.items = action.payload;
         })
         .addCase(fetchFavorites.rejected, (state) => {
            state.isFetching = false;
         })
         // Получаем все избранные товары
         .addCase(fetchFullFavorites.pending, (state) => {
            state.isFetching = true;
         })
         .addCase(fetchFullFavorites.fulfilled, (state, action) => {
            state.isFetching = false;
            state.fullItems = action.payload.products;
         })
         .addCase(fetchFullFavorites.rejected, (state) => {
            state.isFetching = false;
         })
   }
})

export const { clearFavorites } = favoriteSlice.actions;

export default favoriteSlice.reducer;