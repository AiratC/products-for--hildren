import express from 'express';
import { getMessages, sendMessage } from '../controllers/user.controller.js';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

// Отправка сообщения
userRouter.post('/send-user-message', sendMessage);

// Получаем все сообщения
userRouter.get('/get-all-messages', verifyToken, isAdmin, getMessages)



export default userRouter;