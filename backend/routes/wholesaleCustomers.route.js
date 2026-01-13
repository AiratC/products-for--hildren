// Роутинг для оптовых клиентов
import express from 'express';
import { addWholesaleRequest, getWholesaleRequests } from '../controllers/wholesaleCustomers.controller.js';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';

const wholesaleCustomersRouter = express.Router();

// Добавление заявки от оптовика
wholesaleCustomersRouter.post('/wholesale-request', addWholesaleRequest);

// Получение всех заявок оптовиков
wholesaleCustomersRouter.get('/wholesale-requests', verifyToken, isAdmin, getWholesaleRequests)


export default wholesaleCustomersRouter;