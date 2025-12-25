import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import pool from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import authAdminRouter from "./routes/authAdmin.route.js";
import catalogRouter from "./routes/catalog.route.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

app.use(
   cors({
      origin: [`${process.env.FRONTEND_URL}`, `${process.env.ADMIN_PANEL_URL}`],
      credentials: true, // <-- ЭТО КРИТИЧНО для отправки/получения cookie
   })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/admin', authAdminRouter);
app.use('/api/catalog', catalogRouter);


// Запуск сервера с обработкой ошибок
const startServer = () => {
   try {
      app.listen(PORT, () => {
         console.log(`🚀 Сервер запущен на порту: ${PORT}`);
         console.log(`🌐 Frontend: ${process.env.FRONTEND_URL}`);
         console.log(`🔐 Admin: ${process.env.ADMIN_PANEL_URL}`);

         // Проверка соединения с БД
         pool.query('SELECT NOW()', (err, res) => {
            if (err) {
               console.error('❌ Ошибка подключения к PostgreSQL:', err.message);
            } else {
               console.log('🐘 PostgreSQL подключена успешно (время сервера: ' + res.rows[0].now + ')');
            }
         });
      });
   } catch (error) {
      console.error('❌ Ошибка при запуске сервера:', error.message);
      process.exit(1);
   }
};

startServer();