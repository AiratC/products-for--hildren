import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getFetchCartItems, updateCartItem } from '../controllers/cart.controller.js';

const cartRouter = express.Router();

// Добавление, Уменьшение, Увеличение товара в корзину
cartRouter.post('/update-cart-item', protect, updateCartItem);

// При перезагрузки страницы
cartRouter.get('/fetch-cart', protect, getFetchCartItems)


export default cartRouter;