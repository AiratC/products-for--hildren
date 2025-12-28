import express from 'express';
import { getAllCatalog, getMenuStructure } from '../controllers/catalog.controller.js';

const catalogRouter = express.Router();

// Структура меню для админки
catalogRouter.get('/menu-structure', getMenuStructure);

// Получаем весь каталог
catalogRouter.get('/get-all-catalog', getAllCatalog);

export default catalogRouter;