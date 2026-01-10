import express from 'express';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { addStock } from '../controllers/stock.controller.js';
import upload from '../config/cloudinary.js';

const stockRouter = express.Router();

// Добавляем акцию
stockRouter.post('/add-stock', verifyToken, isAdmin, upload.single('stock_image'), addStock);

export default stockRouter;