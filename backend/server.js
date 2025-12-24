import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

app.use(
   cors({
      origin: [`${process.env.FRONTEND_URL}`, `${process.env.ADMIN_PANEL_URL}`],
      credentials: true, // <-- ЭТО КРИТИЧНО для отправки/получения cookie
   })
);

// Тестовый роут, чтобы проверить, что всё работает
app.get("/", (req, res) => {
   res.send("API Baby Shop is running...");
});


// Запуск сервера с обработкой ошибок
const startServer = () => {
   try {
      app.listen(PORT, () => {
         console.log(`🚀 Сервер запущен на порту: ${PORT}`);
         console.log(`🌐 Frontend: ${process.env.FRONTEND_URL}`);
         console.log(`🔐 Admin: ${process.env.ADMIN_PANEL_URL}`);
      });
   } catch (error) {
      console.error('❌ Ошибка при запуске сервера:', error.message);
      process.exit(1);
   }
};

startServer();