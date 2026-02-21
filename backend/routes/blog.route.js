import express from 'express';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';
import upload from '../config/cloudinary.js';
import { addBlog, deleteBlog, getAllBlogs, getBlogs } from '../controllers/blog.controller.js';

const blogRouter = express.Router();

// Добавляем акцию (Только Админ)
blogRouter.post('/add-blog', verifyToken, isAdmin, upload.single('blog_image'), addBlog);

// Удаляем акцию (Только Админ)
blogRouter.delete('/delete-blog/:id', verifyToken, isAdmin, deleteBlog);

// Получаем все блоги
blogRouter.get(`/get-all-blogs`, getAllBlogs);

// Получаем все блоги для фронтенда
blogRouter.get('/get-blogs', getBlogs);

export default blogRouter;