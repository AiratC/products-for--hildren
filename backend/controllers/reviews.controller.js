import { query } from "../config/db.js";

// ! Добавление отзыва
export const addReviews = async (req, res) => {
   // Получаем id пользователя, id товара, имя пользователя, достоинства, недостатки, комментарий, рейтинг
   const { userId, productId, name, advantages, flaws, comment, rating } = req.body;

   if (!userId || !productId || !name || !advantages || !flaws || !comment || !rating) {
      return res.status(400).json({
         message: 'Пожалуйста, заполните все поля',
         error: true,
         success: false
      })
   };

   try {
      await query('BEGIN'); // Начинаем транзакцию

      // Добавляем отзыв в БД
      const insertReviewsSql = `
      INSERT INTO Reviews 
      (user_id, product_id, name, advantages, flaws, comment, rating)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `;
      const reviewsValues = [userId, productId, name, advantages, flaws, comment, rating];

      await query(insertReviewsSql, reviewsValues);

      // Обновляем и средний рейтинг и кол-во отзывов одновременно
      const updateStatsSql = `
      UPDATE Products
         SET 
            rating = ( SELECT COALESCE(AVG(rating)::numeric(2, 1), 0) FROM Reviews WHERE product_id = $1),
            reviews_count = (SELECT COUNT(*) FROM Reviews WHERE product_id = $1)
         WHERE product_id = $1

      `;

      await query(updateStatsSql, [productId]);

      await query('COMMIT'); // Подтверждаем измененния

      return res.status(201).json({
         message: 'Отзыв успешно добавлен, рейтинг товара обновлен',
         error: false,
         success: true
      })

   } catch (error) {
      await query('ROLLBACK');
      return res.status(500).json({
         message: 'Ошибка при добавлении отзыва на сервере',
         error: true,
         success: false
      })
   }
}

