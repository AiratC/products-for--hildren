import express from 'express';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { 
   createProduct, 
   deleteProduct, 
   getAllNewProducts, 
   getProductsByCategory, 
   getProductsByFilters, 
   getTwoRandomProduct, 
   updateProduct 
} from '../controllers/product.controller.js';
import upload from '../config/cloudinary.js';


const productRouter = express.Router();

// Создаем товар (Только админ)
productRouter.post('/create-product', verifyToken, isAdmin, upload.array('product_images', 10), createProduct);

// Получаем товары конкретной категории (Только админ)
productRouter.get('/get-category/:id', verifyToken, isAdmin, getProductsByCategory);

// Удаляем товар (Только админ)
productRouter.delete('/delete-product/:id', verifyToken, isAdmin, deleteProduct);

// Обновляем товар (Только админ)
productRouter.patch('/update-product/:id', verifyToken, isAdmin, upload.array('product_images', 10), updateProduct);

// Получаем товары с фильтрацией
productRouter.get('/get-products-by-filters', getProductsByFilters);

// Получаем два рандомных товара
productRouter.get('/get-two-random-products', getTwoRandomProduct);

// Получаем все новинки
productRouter.get('/get-all-new-products', getAllNewProducts);

export default productRouter;