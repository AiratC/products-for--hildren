import express from 'express';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { addStock, deleteStock, getAllStocks } from '../controllers/stock.controller.js';
import upload from '../config/cloudinary.js';

const stockRouter = express.Router();

// Добавляем акцию (Только Админ)
stockRouter.post('/add-stock', verifyToken, isAdmin, upload.single('stock_image'), addStock);

// Удаляем акцию (Только Админ)
stockRouter.delete('/delete-stock/:id', verifyToken, isAdmin, deleteStock);

// Получаем все акции 
stockRouter.get(`/get-all-stocks`, getAllStocks);

export default stockRouter;