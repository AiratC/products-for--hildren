import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createOrder } from '../controllers/order.controller.js';

const orderRouter = express.Router();

// Создание заказа
orderRouter.post('/create-order', protect, createOrder);


export default orderRouter;