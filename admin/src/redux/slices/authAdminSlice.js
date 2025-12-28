import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchAxios } from '../../utils/fetchAxios'


export const adminLogin = createAsyncThunk(
   'admin/fetchByAdminLogin',
   async (values, thunkAPI) => {
      try {
         const response = await fetchAxios.post('/api/admin/login', values);
         return response.data
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
      }
   },
)

export const checkAuth = createAsyncThunk(
   'admin/checkAuth',
   async (_, thunkAPI) => {
      try {
         const response = await fetchAxios.get('/api/admin/me');
         return response.data;
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
      }
   }
)



const initialState = {
   loading: false,
   error: false,
   success: false,
   admin: undefined,
   message: '',
   isCheckingAuth: true,
}

export const authAdminSlice = createSlice({
   name: 'authAdmin',
   initialState,
   reducers: {
      clearStateAdmin: (state) => {
         state.error = false,
         state.success = false,
         state.message = '',
         state.isCheckingAuth = false;
      }
   },
   extraReducers: (builder) => {
      builder.addCase(adminLogin.pending, (state) => {
         state.loading = true;
      }),
      builder.addCase(adminLogin.fulfilled, (state, action) => {
         state.loading = false;
         state.success = action.payload.success;
         state.message = action.payload.message;
         state.admin = action.payload.user;

      }),
      builder.addCase(adminLogin.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload.error;
         state.message = action.payload.message;
      }),
      // Проверка на авторизацию
      builder.addCase(checkAuth.pending, (state) => {
         state.loading = true;
      }),
      builder.addCase(checkAuth.fulfilled, (state, action) => {
         state.loading = false;
         state.isCheckingAuth = false;
         state.success = action.payload.success;
         state.message = action.payload.message;
         state.admin = action.payload.user;

      }),
      builder.addCase(checkAuth.rejected, (state) => {
         state.loading = false;
         state.isCheckingAuth = false;
         state.admin = undefined;
      })
   }
})


export const { clearStateAdmin } = authAdminSlice.actions

export default authAdminSlice.reducer