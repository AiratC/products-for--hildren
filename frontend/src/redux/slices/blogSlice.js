import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchAxios from "../../utils/fetchAxios";


export const fetchBlogs = createAsyncThunk(
   "blogs/fetchBlogs", 
   async (page, thunkAPI) => {
   try {
      const response = await fetchAxios.get(`/api/blogs/get-blogs?page=${page}`);
      return response.data;
   } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
   }
});

const blogSlice = createSlice({
   name: "blogs",
   initialState: { items: [], totalPages: 1, currentPage: 1, loading: false },
   reducers: {
      setCurrentPage: (state, action) => {
         state.currentPage = action.payload;
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchBlogs.pending, (state) => {
            state.loading = true;
         })
         .addCase(fetchBlogs.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload.blogs;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
         })
         .addCase(fetchBlogs.rejected, (state, action) => {
            state.loading = false;
            state.items = action.payload.blogs;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
         });;
   },
});

export const { setCurrentPage } = blogSlice.actions;

export default blogSlice.reducer;
