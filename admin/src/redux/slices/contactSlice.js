import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAxios } from "../../utils/fetchAxios";


export const getAllMessages = createAsyncThunk(
   'contact/fetchGetAllMessages',
   async (_, { rejectWithValue }) => {
      try {
         const response = await fetchAxios.get('/api/contact/get-all-messages');
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
)



const initialState = {
   messages: [],
   loading: false,
   success: false,
   error: false
};

const contactSlice = createSlice({
   name: 'contact',
   initialState,
   reducers: {
      // Очистка состояния
      clearContactState: (state) => {
         state.success = false;
         state.error = false
      }
   },
   extraReducers: (builder) => {
      builder
      // ! Получаем все сообщения
      .addCase(getAllMessages.pending, (state) => {
         state.loading = true;
      })
      .addCase(getAllMessages.fulfilled, (state, action) => {
         state.loading = false;
         state.messages = action.payload.data
      })
      .addCase(getAllMessages.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload.error;
      })
      

   }
});


export const { clearContactState } = contactSlice.actions;

export default contactSlice.reducer