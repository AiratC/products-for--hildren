import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAxios } from "../../utils/fetchAxios";
import { message } from "antd";

// ! Получаем все сообщения
export const getAllMessages = createAsyncThunk(
   'contact/fetchGetAllMessages',
   async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
      console.log(page)
      try {
         const response = await fetchAxios.get(`/api/contact/get-all-messages?page=${page}&limit=${limit}`);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
)

// ! Меняем статус сообщения на прочитано
export const markMessageRead = createAsyncThunk(
   'contact/fetchmarkMessageRead',
   async (contactId, { rejectWithValue }) => {
      try {
         const response = await fetchAxios.patch(`/api/contact/read/${contactId}`);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
)



const initialState = {
   messages: [],
   pagination: { total: 0, currentPage: 1 },
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
         state.messages = action.payload.data || [];
         state.pagination = action.payload.pagination;
      })
      .addCase(getAllMessages.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload?.error || 'Ошибка загрузки';
      })
      // ! Меняем статус сообщения на прочитано
      .addCase(markMessageRead.pending, (state) => {
         state.loading = true;
      })
      .addCase(markMessageRead.fulfilled, (state, action) => {
         state.loading = false;

         // 1 Находим сообщение в массиве и меняем ему статус локально
         const index = state.messages.findIndex(m => m.contact_id === action.meta.arg);
         if(index !== -1) {
            state.messages[index].status = 'read'
         }

         message.success(action.payload.message || 'Прочитано')
      })
      .addCase(markMessageRead.rejected, (state, action) => {
         state.loading = false;
         message.error(action.payload?.message || 'Ошибка при обновлении')
      })
      

   }
});


export const { clearContactState } = contactSlice.actions;

export default contactSlice.reducer