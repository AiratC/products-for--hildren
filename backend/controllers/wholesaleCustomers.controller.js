import { query } from "../config/db.js";

// ! Добавление заявки от оптового клиента
export const addWholesaleRequest = async (req, res) => {
   const { name, phone, email, city, captcha, is_agree } = req.body;

   if(!name || !phone || !email || !city || is_agree === undefined) {
      return res.status(400).json({
         message: 'Пожалуйста, заполните все обязательные поля',
         error: true,
         success: false
      })
   };

   if(!is_agree) {
      return res.status(400).json({
         message: 'Необходимо согласие на обработку персональных данных',
         error: true,
         success: false
      })
   }

   try {
      // Проверка формата email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)) {
         return res.status(400).json({
            message: 'Некорректный формат email',
            error: true,
            success: false
         })
      };

      // Логика проверки капчи
      if(!captcha || captcha !== req.session?.captcha_code) {
         // return res.status(400).json({
         //    message: 'Неверная капча'
         // })
      }

      const querySql = `
         INSERT INTO Wholesale_Customers (name, phone, email, city, captcha, is_agree)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `;

      const values = [name, phone, email, city, captcha, is_agree];

      await query(querySql, values);

      return res.status(201).json({
         message: 'Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время',
         success: true,
         error: false
      })


   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при отправке заявки на сервере',
         error: true, 
         success: false
      })
   }
}

