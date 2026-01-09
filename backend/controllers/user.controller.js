import { query } from "../config/db.js";

// ! Сообщения пользователя
export const sendMessage = async (req, res) => {
   try {
      const { name, phone, message, is_agree } = req.body;

      // Очищаем данные от случайных пробелов
      const cleanName = name?.trim();
      const cleanPhone = phone?.trim();
      const cleanMessage = message?.trim();

      // Проверяем что пользователь ввел имя, телефон, сообщение, согласие на обработку персональных данных
      // is_agree должно быть true
      if(!cleanName || !cleanPhone || !cleanMessage) {
         return res.status(400).json({
            message: 'Заполните поля Имя, Телефон, Сообщение',
            success: false,
            error: true
         })
      }

      // Отдельная проверка на is_agree
      if(is_agree !== true && is_agree !== 'true') {
         return res.status(400).json({
            message: 'Подтвердите согласие на обработку персональных данных',
            error: true,
            success: false
         })
      };

      // Создаем sql запрос и добавляем данные в БД
      const sql = `
         INSERT INTO Contacts 
         (name, phone, message, is_agree)
         VALUES ($1, $2, $3, $4)
         RETURNING contact_id
      `;

      await query(sql, [cleanName, cleanPhone, cleanMessage, is_agree]);

      return res.status(200).json({
         message: 'Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время',
         success: true,
         error: false
      })
      
   } catch (error) {
      return res.status(500).json({
         message: 'Извините, произошла ошибка при отправке сообщения. Попробуйте позже.',
         error: true,
         success: false
      })
   }
};

// ! Получение всех сообщений для админки
export const getMessages = async (req, res) => {
   try {
      const result = await query(
         `SELECT * FROM Contacts ORDER BY created_at DESC`
      );

      return res.status(200).json({
         success: true,
         error: false,
         data: result.rows
      })
   } catch (error) {
      return res.status(500).json({
         message: "Ошибка при получении сообщений на сервере",
         error: true,
         success: false
      })
   }
}

