// Роутинг для оптовых клиентов
import express from 'express';
import { addWholesaleRequest } from '../controllers/wholesaleCustomers.controller.js';

const wholesaleCustomersRouter = express.Router();

wholesaleCustomersRouter.post('/wholesale-request', addWholesaleRequest);


export default wholesaleCustomersRouter;