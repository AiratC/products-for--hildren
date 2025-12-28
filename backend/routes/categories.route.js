import express from 'express';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { createCategory } from '../controllers/category.controller.js';

const categoryRouter = express.Router();

// Создаем категорию
categoryRouter.post('/create-category', verifyToken, isAdmin, createCategory);

export default categoryRouter;