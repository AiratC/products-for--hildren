import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js';

const authRouter = express.Router();

// Регистрация пользователя
authRouter.post('/register', registerUser);

// Вход пользователя
authRouter.post('/login', loginUser);

// Выход пользователя
authRouter.get('/logout', logoutUser);


export default authRouter;