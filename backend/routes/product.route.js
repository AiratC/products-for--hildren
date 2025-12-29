import express from 'express';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { createProduct, getProductsByCategory } from '../controllers/product.controller.js';
import upload from '../config/cloudinary.js';


const productRouter = express.Router();

// Создаем товар
productRouter.post('/create-product', verifyToken, isAdmin, upload.array('product_images', 10), createProduct);

// Получаем товары конкретной категории
productRouter.get('/get-category/:id', getProductsByCategory);

export default productRouter;