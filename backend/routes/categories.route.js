import express from 'express';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { createCategory, getAllCategories } from '../controllers/category.controller.js';

const categoryRouter = express.Router();

// Создаем категорию
categoryRouter.post('/create-category', verifyToken, isAdmin, createCategory);

// Получаем все категории
categoryRouter.get('/get-all-categories', getAllCategories);

export default categoryRouter;