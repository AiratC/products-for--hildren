import express from 'express';
import { getMessages, sendMessage } from '../controllers/contact.controller.js';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';

const contactRouter = express.Router();

// Отправка сообщения
contactRouter.post('/send-user-message', sendMessage);

// Получаем все сообщения
contactRouter.get('/get-all-messages', verifyToken, isAdmin, getMessages)



export default contactRouter;