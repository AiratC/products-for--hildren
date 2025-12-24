import express from 'express';
import { registerUser } from '../controllers/auth.controller.js';

const authRouter = express.Router();

// Регистрация пользователя
authRouter.post('/register', registerUser);


export default authRouter;