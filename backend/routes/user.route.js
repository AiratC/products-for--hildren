import express from 'express';
import { sendMessage } from '../controllers/user.controller.js';

const userRouter = express.Router();

// Отправка сообщения
userRouter.post('/send-user-message', sendMessage);



export default userRouter;