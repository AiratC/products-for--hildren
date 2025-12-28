import express from 'express';
import { getMe, loginAdmin, logoutAdmin } from '../controllers/authAdmin.controller.js';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';

const authAdminRouter = express.Router();

// Вход в админку
authAdminRouter.post('/login', loginAdmin);

// Выход из админки
authAdminRouter.get('/logout', logoutAdmin);

// Проверка сессии
authAdminRouter.get('/me', verifyToken, isAdmin, getMe);

export default authAdminRouter;