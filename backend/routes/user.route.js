import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMe } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.get('/me', protect, getMe);

export default userRouter;