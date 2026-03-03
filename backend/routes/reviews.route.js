import express from 'express';
import { addReviews, checkReviewEligibility, getAllReviewsById } from '../controllers/reviews.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const reviewsRouter = express.Router();

// Добавить отзыв
reviewsRouter.post('/add-reviews', addReviews);

// Получаем все отзывы конкретного товара
reviewsRouter.get('/get-all-reviews/:id', getAllReviewsById);

// Отображаем кнопку отзыва на товар на котором ещё нет отзыва после покупки
reviewsRouter.get('/check-review-eligibility', protect, checkReviewEligibility);


export default reviewsRouter;