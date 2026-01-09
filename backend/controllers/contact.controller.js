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
      // Получаем страницу
      const page = parseInt(req.query.page) || 1;
      // Лимит
      const limit = parseInt(req.query.limit) || 10;
      // Смещение
      const offset = (page - 1) * limit;

      // Получаем общее кол-во сообщений для расчета страниц на фронте
      const countResult = await query(`SELECT COUNT(*) FROM Contacts`);
      const totalMessage = parseInt(countResult.rows[0].count);

      // Получаем только нужную порцию данных
      const result = await query(
         `
         SELECT * FROM Contacts
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2
         `,
         [limit, offset]
      )

      return res.status(200).json({
         success: true,
         error: false,
         data: result.rows,
         pagination: {
            total: totalMessage,
            currentPage: page,
            totalPages: Math.ceil(totalMessage / limit),
            limit
         }
      });

   } catch (error) {
      return res.status(500).json({
         message: "Ошибка при получении сообщений на сервере",
         error: true,
         success: false
      })
   }
}

// ! Обновление статуса сообщения на прочитано
export const markAsRead = async (req, res) => {
   const { id } = req.params;

   try {
      await query(
         `UPDATE Contacts SET status = 'read' WHERE contact_id = $1`,
         [id]
      );

      return res.status(200).json({
         message: 'Прочитано',
         success: true,
         error: false
      })
   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при смене статуса сообщения на сервере',
         success: false,
         error: true
      })
   }
};

// ! Удаляем сообщение
export const deleteMessage = async (req, res) => {
   try {
      const { id } = req.params;

      const result = await query(
         `DELETE FROM Contacts WHERE contact_id = $1 RETURNING *`,
         [id]
      );

      if(result.rowCount === 0) {
         return res.status(404).json({
            message: 'Сообщение не найдено',
            success: false,
            error: true
         })
      };

      return res.status(200).json({
         message: 'Сообщение успешно удалено',
         success: true,
         error: false
      });

   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка на сервере при удалении сообщения',
         success: false,
         error: true
      })
   }
}

