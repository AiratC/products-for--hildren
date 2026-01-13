

export const getCaptcha = (req, res) => {
   // Генерируем случайное 4-значное число
   const code = Math.floor(1000 + Math.random() * 9000).toString();

   // Сохраняем в сессию
   req.session.captcha = code;

   return res.status(200).json({ code });
}