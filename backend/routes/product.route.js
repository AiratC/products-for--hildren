import express from 'express';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { createProduct } from '../controllers/product.controller.js';


const productRouter = express.Router();

// Создаем товар
productRouter.post('/create-product', verifyToken, isAdmin, createProduct);

export default productRouter;