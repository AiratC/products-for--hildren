import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAxios } from '../../utils/fetchAxios';


export const fetchWholesaleRequests = createAsyncThunk(
   'wholesale/fetchAll',
   async (_, { rejectWithValue }) => {
      try {
         const { data } = await fetchAxios.get('/api/wholesale-customers/wholesale-requests');
         return data;
      } catch (err) {
         return rejectWithValue(err.response.data);
      }
   }
);

const wholesaleSlice = createSlice({
   name: 'wholesale',
   initialState: { items: [], loading: false, error: null },
   extraReducers: (builder) => {
      builder
         .addCase(fetchWholesaleRequests.pending, (state) => { state.loading = true; })
         .addCase(fetchWholesaleRequests.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
         })
         .addCase(fetchWholesaleRequests.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         });
   },
});

export default wholesaleSlice.reducer;