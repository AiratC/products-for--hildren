import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createOrder, getMyOrders, getOrders } from '../controllers/order.controller.js';

const orderRouter = express.Router();

// Создание заказа
orderRouter.post('/create-order', protect, createOrder);

// Получаем все заказы пользователя
orderRouter.get('/get-orders', protect, getMyOrders);

// Получаем все заказы
orderRouter.get('/get-all-orders', getOrders)


export default orderRouter;