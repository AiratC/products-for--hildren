import express from 'express';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { addStock, deleteStock } from '../controllers/stock.controller.js';
import upload from '../config/cloudinary.js';

const stockRouter = express.Router();

// Добавляем акцию
stockRouter.post('/add-stock', verifyToken, isAdmin, upload.single('stock_image'), addStock);

// Удаляем акцию
stockRouter.delete('/delete-stock/:id', verifyToken, isAdmin, deleteStock);

// Получаем все акции


export default stockRouter;