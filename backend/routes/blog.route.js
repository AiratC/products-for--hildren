import express from 'express';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';
import upload from '../config/cloudinary.js';
import { addBlog, deleteBlog, getAllBlogs } from '../controllers/blog.controller.js';

const blogRouter = express.Router();

// Добавляем акцию (Только Админ)
blogRouter.post('/add-blog', verifyToken, isAdmin, upload.single('blog_image'), addBlog);

// Удаляем акцию (Только Админ)
blogRouter.delete('/delete-blog/:id', verifyToken, isAdmin, deleteBlog);

// Получаем все акции 
blogRouter.get(`/get-all-blogs`, getAllBlogs);

export default blogRouter;