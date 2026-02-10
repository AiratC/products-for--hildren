import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import fetchAxios from '../../utils/fetchAxios';


// Вход пользователя
export const userLogin = createAsyncThunk(
   'user/fetchByUserLogin',
   async (values, thunkAPI) => {
      try {
         const response = await fetchAxios.post('/api/auth/login', values);
         return response.data
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
      }
   },
);

// Выход пользователя
export const userLogout = createAsyncThunk(
   'user/fetchByUserLogout',
   async (_, thunkAPI) => {
      try {
         const response = await fetchAxios.get('/api/auth/logout');
         return response.data
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
      }
   },
);

export const checkAuth = createAsyncThunk(
   'user/checkAuth',
   async (_, thunkAPI) => {
      try {
         const response = await fetchAxios.get('/api/user/me');
         return response.data;
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
      }
   }
);

const initialState = {
   loading: false,
   error: false,
   success: false,
   user: undefined,
   message: '',
   isCheckingAuth: true,
}

export const authUserSlice = createSlice({
   name: 'authUser',
   initialState,
   reducers: {
      clearState: (state) => {
         state.error = false,
         state.success = false,
         state.message = '',
         state.isCheckingAuth = false;
      }
   },
   extraReducers: (builder) => {
      builder
         // Вход пользователя
         .addCase(userLogin.pending, (state) => {
            state.loading = true;
         })
         .addCase(userLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
         })
         .addCase(userLogin.rejected, (state) => {
            state.loading = false;
         })
         // Выход пользователя
         .addCase(userLogout.pending, (state) => {
            state.loading = true;
         })
         .addCase(userLogout.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.isCheckingAuth = false;
         })
         .addCase(userLogout.rejected, (state) => {
            state.loading = false;
            state.isCheckingAuth = false;
         })
         // Проверка сессии пользователя
         .addCase(checkAuth.pending, (state) => {
            state.isCheckingAuth = true;
         })
         .addCase(checkAuth.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.isCheckingAuth = false;
         })
         .addCase(checkAuth.rejected, (state) => {
            state.user = undefined;
            state.isCheckingAuth = false;
         })
   }
})


export const { clearState } = authUserSlice.actions;

export default authUserSlice.reducer;