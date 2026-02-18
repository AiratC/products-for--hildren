import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createOrder, getMyOrders } from '../controllers/order.controller.js';

const orderRouter = express.Router();

// Создание заказа
orderRouter.post('/create-order', protect, createOrder);

// Получаем все заказы пользователя
orderRouter.get('/get-orders', protect, getMyOrders);


export default orderRouter;