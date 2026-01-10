import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAxios } from "../../utils/fetchAxios";
import { message } from "antd";

// ! Добавляем блог
export const addBlog = createAsyncThunk(
   'blog/addBlog',
   async (formData, { rejectWithValue }) => {
      try {
         const response = await fetchAxios.post(`/api/blogs/add-blog`, formData);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
);

// ! Удалени блога
export const deleteBlog = createAsyncThunk(
   'blog/deleteBlog',
   async (blogId, {rejectWithValue}) => {
      try {
         const response = await fetchAxios.delete(`/api/blogs/delete-blog/${blogId}`);
         return {blogId, ...response.data};
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
)

// ! Получение всех блогов
export const getAllBlogs = createAsyncThunk(
   'blog/getAllBlogs',
   async ({page = 1, limit = 12 }, { rejectWithValue }) => {
      try {
         const response = await fetchAxios.get(`/api/blogs/get-all-blogs?page=${page}&limit=${limit}`);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
)

const initialState = {
   blogs: [],
   loading: false,
   success: false,
   error: false,
   total: 0
};

const blogSlice = createSlice({
   name: 'blog',
   initialState,
   reducers: {
      // Очистка состояния
      clearBlogState: (state) => {
         state.success = false;
         state.error = false;
      }
   },
   extraReducers: (builder) => {
      builder
      // ! Добавляем блог
      .addCase(addBlog.pending, (state) => {
         state.loading = true;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
         state.loading = false;
         state.blogs.unshift(action.payload.data);
         message.success(action.payload.message || 'Усаешное добавление блога')
      })
      .addCase(addBlog.rejected, (state, action) => {
         state.loading = false;
         message.error(action.payload.error || 'Ошибка при создании блога')
      })
      // ! Получаем все блоги
      .addCase(getAllBlogs.pending, (state) => {
         state.loading = true;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
         state.loading = false;
         state.blogs = action.payload.blogs;
         state.total = action.payload.total
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
         state.loading = false;
         message.error(action.payload.error || 'Ошибка при получении блогов')
      })
      // ! Удаляем блог
      .addCase(deleteBlog.pending, (state) => {
         state.loading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
         state.loading = false;
         state.blogs = state.blogs.filter(blog => blog.blog_id !== action.payload.blogId)
         message.success(action.payload.message)
      })
      .addCase(deleteBlog.rejected, (state, action) => {
         state.loading = false;
         message.error(action.payload.error || 'Ошибка при удалении блога')
      })
   }
});


export const { clearBlogState } = blogSlice.actions;

export default blogSlice.reducer;