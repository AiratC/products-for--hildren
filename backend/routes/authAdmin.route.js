import express from 'express';
import { loginAdmin, logoutAdmin } from '../controllers/authAdmin.controller.js';

const authAdminRouter = express.Router();

// Вход в админку
authAdminRouter.post('/login', loginAdmin);

// Выход из админки
authAdminRouter.get('/logout', logoutAdmin);

export default authAdminRouter;