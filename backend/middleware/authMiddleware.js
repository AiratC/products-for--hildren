import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
   const token = req.cookies.token;

   if (!token) {
      return res.status(401).json({
         message: "Вы не авторизованы (Токен отсутствует)",
         error: true,
         success: false
      })
   };
   try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);

      req.user = decode;

      next()

   } catch (error) {
      return res.status(403).json({
         message: "Неверный или просроченый токен",
         error: true,
         success: false
      })
   }
};

export const isAdmin = (req, res, next) => {
   try {
      // Проверяем, есть ли пользователь и равен ли его roleId единице (Админ)
      if (req.user && req.user.roleId === 1) {
         return next(); // Обязательно return, чтобы код ниже не выполнялся
      }

      return res.status(403).json({
         message: 'Доступ запрещен: требуются права администратора',
         error: true,
         success: false
      });
   } catch (error) {
      return res.status(500).json({
         message: "Ошибка при проверке прав доступа",
         error: true
      });
   }
};