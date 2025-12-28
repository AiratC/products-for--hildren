import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchAxios } from '../../utils/fetchAxios'


export const createCategory = createAsyncThunk(
   'admin/fetchByCreateCategory',
   async (values, thunkAPI) => {
      try {
         const response = await fetchAxios.post('/api/categories/create-category', values);
         return response.data
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
      }
   },
)



const initialState = {
   categories: [],
   loading: false,
   error: false,
   success: false,
   message: '',
}

export const categorySlice = createSlice({
   name: 'category',
   initialState,
   reducers: {
      clearStateCategory: (state) => {
         state.error = false,
         state.success = false,
         state.message = ''
      }
   },
   extraReducers: (builder) => {
      // ! Создаём категорию
      builder.addCase(createCategory.pending, (state) => {
         state.loading = true;
         state.error = false;
         state.success = false;
      }),
      builder.addCase(createCategory.fulfilled, (state, action) => {
         state.loading = false;
         state.success = action.payload.success;
         state.error = action.payload.error;
         state.message = action.payload.message;

         // Добавляем новую категорию в начало списка
         if(action.payload.category) {
            state.categories.unshift(action.payload.category)
         };


         console.log(`createCategory.fulfilled: `, action)
         
      }),
      builder.addCase(createCategory.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload.error;
         state.success = action.payload.success;
         // Берём сообщение об ошибке, которое прислал нам бэкенд через rejectWithValue
         state.message = action.payload?.message || 'Ошибка при создании категории';

         console.log(`createCategory.rejected: `, action)
      })
   }
})


export const { clearStateCategory } = categorySlice.actions;

export default categorySlice.reducer;