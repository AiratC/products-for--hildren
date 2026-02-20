import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMe, updateUserData } from '../controllers/user.controller.js';
import upload from '../config/cloudinary.js';

const userRouter = express.Router();

userRouter.get('/me', protect, getMe);

// Обновляем данные пользователя
userRouter.post('/update-user-profile', protect, upload.single('newAvatar'), updateUserData);

export default userRouter;