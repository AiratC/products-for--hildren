import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAxios } from "../../utils/fetchAxios";
import { message } from "antd";

// ! Создание товара
export const createProduct = createAsyncThunk(
   'product/createProduct',
   async (productData, { rejectWithValue }) => {
      try {
         const formData = new FormData();

         // Добавляем простые поля
         formData.append('category_id', productData.category_id);
         formData.append('title', productData.title);
         formData.append('description', productData.description);
         formData.append('price', productData.price);
         formData.append('article', productData.article);

         // Превращаем объект характеристик в строку
         formData.append('characteristics', JSON.stringify(productData.characteristics));

         // Добавляем файлы (важно: имя поля 'product_images' должен совпадать с тем что в роуте)
         if (productData.product_images) {
            productData.product_images.forEach(file => {
               formData.append('product_images', file.originFileObj);
            });
         }


         const response = await fetchAxios.post('/api/products/create-product', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         });
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response.data);
      };
   }
);

const initialState = {
   products: [],
   loading: false,
   success: false,
   error: null,
};

const productSlice = createSlice({
   name: 'product',
   initialState,
   reducers: {
      clearProductState: (state) => {
         state.success = false;
         state.error = null;
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(createProduct.pending, (state) => {
            state.loading = true;
         })
         .addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.products.unshift(action.payload.product);
            message.success('Товар успешно создан')
         })
         .addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            message.error(action.payload.message || 'Ошибка при создании товара');
         })
   }
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;