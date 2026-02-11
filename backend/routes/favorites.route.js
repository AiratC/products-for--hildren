import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
   getAllFavorites, 
   getFullFavorite, 
   toggleFavorite 
} from '../controllers/favorites.controller.js';

const favoriteRouter = express.Router();

// Добавление и удаление избранного товара
favoriteRouter.post('/toggle', protect, toggleFavorite);

// Получаем все товары пользователя которые добавлены в избранное
favoriteRouter.get('/get-all-favorites', protect, getAllFavorites);

// Получаем избранные товары
favoriteRouter.get('/get-full-favorites', protect, getFullFavorite)

export default favoriteRouter;