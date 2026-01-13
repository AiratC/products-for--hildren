import express from 'express';
import { getCaptcha } from '../controllers/captcha.controller.js';

const captchaRouter = express.Router();

captchaRouter.get('/get-captcha', getCaptcha);

export default captchaRouter;