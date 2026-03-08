import { query } from "../config/db.js";

// ! Добавление заявки от оптового клиента
export const addWholesaleRequest = async (req, res) => {
   const { name, phone, email, city, captcha, is_agree } = req.body;
   console.log({ name, phone, email, city, captcha, is_agree })

   // Пример базовой очистки строк перед сохранением
   const cleanName = name.trim().replace(/[<>]/g, "");
   const cleanCity = city.trim().replace(/[<>]/g, "");

   if (!cleanName || !phone || !email || !cleanCity || is_agree === undefined) {
      return res.status(400).json({
         message: 'Пожалуйста, заполните все обязательные поля',
         error: true,
         success: false
      })
   };

   if (!is_agree) {
      return res.status(400).json({
         message: 'Необходимо согласие на обработку персональных данных',
         error: true,
         success: false
      })
   }

   // Проверка формата email
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
      return res.status(400).json({
         message: 'Некорректный формат email',
         error: true,
         success: false
      })
   };

   // Логика проверки капчи - проверяем совпадает ли капча с той что в сессии
   if (!req.session.captcha || captcha.toLowerCase() !== req.session.captcha) {
      console.log(req.session.captcha);
      console.log(captcha)
      return res.status(400).json({
         message: 'Неверная капча',
         error: true,
         success: false
      })
   }

   try {
      // Если всё верно то удаляем капчу из сессии
      delete req.session.captcha;

      const querySql = `
         INSERT INTO Wholesale_Customers (name, phone, email, city, captcha, is_agree)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `;

      const values = [cleanName, phone, email, cleanCity, captcha, is_agree];

      await query(querySql, values);

      return res.status(201).json({
         message: 'Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время',
         success: true,
         error: false
      })


   } catch (error) {
      console.log(error)
      return res.status(500).json({
         message: 'Ошибка при отправке заявки на сервере',
         error: true,
         success: false
      })
   }
}

// ! Получение списка всех заявок от оптовиков
export const getWholesaleRequests = async (req, res) => {
   try {
      const requests = await query(
         'SELECT * FROM wholesale_customers ORDER BY id DESC'
      );
      res.status(200).json(requests.rows);
   } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении заявок' });
   }
};

