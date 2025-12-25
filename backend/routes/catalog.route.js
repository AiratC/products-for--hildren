import express from 'express';
import { getMenuStructure } from '../controllers/catalog.controller.js';

const catalogRouter = express.Router();

catalogRouter.get('/menu-structure', getMenuStructure);

export default catalogRouter;