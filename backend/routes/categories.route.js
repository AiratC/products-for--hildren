import express from 'express';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { createCategory, getAllCategories, getCategoriesByCatalogId, getCategoryPageData } from '../controllers/category.controller.js';

const categoryRouter = express.Router();

// Создаем категорию (Только админ)
categoryRouter.post('/create-category', verifyToken, isAdmin, createCategory);

// Получаем все категории
categoryRouter.get('/get-all-categories', getAllCategories);

// Получаем все категории конкретного каталога по catalog_id
categoryRouter.post('/get-categories-by-catalog-id', getCategoriesByCatalogId);

// Получаем каталог с категориями и товары 
categoryRouter.get('/get-category-page-data/:slug', getCategoryPageData);

export default categoryRouter;