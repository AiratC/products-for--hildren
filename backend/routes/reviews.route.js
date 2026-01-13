import express from 'express';
import { addReviews } from '../controllers/reviews.controller.js';

const reviewsRouter = express.Router();

reviewsRouter.post('/add-reviews', addReviews);


export default reviewsRouter;