import express from 'express';
import { deleteMessage, getMessages, markAsRead, sendMessage } from '../controllers/contact.controller.js';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';

const contactRouter = express.Router();

// Отправка сообщения
contactRouter.post('/send-user-message', sendMessage);

// Получаем все сообщения (Только админ)
contactRouter.get('/get-all-messages', verifyToken, isAdmin, getMessages);

// Смена статуса сообщения на прочитано (Только админ)
contactRouter.patch('/read/:id', verifyToken, isAdmin, markAsRead);

// Удаляем сообщение (Только админ)
contactRouter.delete('/delete-message/:id', verifyToken, isAdmin, deleteMessage);



export default contactRouter;