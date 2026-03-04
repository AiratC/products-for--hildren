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
};

// Получаем все отзывы конкретного товара
export const getAllReviewsById = async (req, res) => {
   const { id } = req.params;
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 2;
   const offset = (page - 1) * limit;

   try {
      // Получаем общее кол-во и СРЕДНИЙ рейтинг
      const statsResult = await query(
         `
            SELECT
               COUNT(*) as total_count,
               AVG(rating) as average_rating
            FROM Reviews
            WHERE product_id = $1
         `,
         [id]
      );

      const totalCount = parseInt(statsResult.rows[0].total_count) || 0;
      // Округляем до 1 знака после запятой (например, 4.5)
      const averageRating = totalCount > 0 ?
         parseFloat(Number(statsResult.rows[0].average_rating).toFixed(1)) :
         0;

      // Получаем отзывы конкретного товара
      const reviewsResult = await query(
         `SELECT 
            r.*, 
            u.avatar
         FROM Reviews r
         LEFT JOIN Users u ON r.user_id = u.user_id
         WHERE r.product_id = $1 
         ORDER BY r.created_at DESC 
         LIMIT $2 OFFSET $3`,
         [id, limit, offset]
      );

      if(reviewsResult.rows.length === 0) {
         return res.status(200).json({
            reviews: [],
            totalPages: 0,
            currentPage: page,
            totalCount: 0,
            averageRating
         })
      };

      return res.status(200).json({
         reviews: reviewsResult.rows,
         totalPages: Math.ceil(totalCount / limit),
         currentPage: page,
         totalCount,
         averageRating
      })
   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при получении отзывов на сервере'
      })
   }
};

// Контроллер для отображения кнопки оставить отзыв
export const checkReviewEligibility = async (req, res) => {
   // Получаем id пользователя
   const userId = req.userId;
   // Получаем id товара
   const { productId } = req.query;

   try {
      const result = await query(
         `
            SELECT oi.order_item_id
            FROM order_items oi
            JOIN orders o ON o.order_id = oi.order_id
            WHERE oi.product_id = $1
               AND o.user_id = $2
               AND o.order_status = 'delivered'
               AND oi.order_item_id NOT IN (
                  SELECT order_item_id FROM reviews WHERE order_item_id IS NOT NULL
               )
            LIMIT 1
         `, [productId, userId]
      );

      return res.status(200).json({
         // Если массив rows не пустой, значит есть покупка без отзыва
         canReview: result.rows.length > 0,
         // Теперь здесь будет реальный ID, а не undefined
         availableOrderItemId: result.rows.length > 0 ? result.rows[0].order_item_id : null,
         success: true
      })

   } catch (error) {
      console.log(error)
      return res.status(500).json({
         message: 'Ошибка сервера'
      })
   }
};

// Создание и добавление отзыва
export const createReview = async (req, res) => {
   const {
      productId, 
      orderItemId, 
      name, 
      advantages, 
      flaws, 
      comment, 
      rating
   } = req.body;

   // ID пользователя из middleware авторизации
   const userId = req.userId;

   try {
      // Сначала проверим, не оставлял ли пользователь отзыв на этот order_item_id ранее
      const existingReview = await query(
         `SELECT review_id FROM Reviews WHERE order_item_id = $1`, [orderItemId]
      );

      if(existingReview.rows.length > 0) {
         return res.status(400).json({
            success: false,
            message: 'Вы уже оставляли отзыв на этот товар'
         })
      };

      // Сохраняем отзыв в базу
      const newReview = await query(
         `
            INSERT INTO Reviews (
               user_id,
               product_id,
               order_item_id,
               name,
               advantages,
               flaws,
               comment,
               rating
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
         ` , [userId, productId, orderItemId, name, advantages, flaws, comment, rating]
      );

      return res.status(200).json({
         message: 'Отзыв опубликован',
         success: true,
         review: newReview.rows[0]
      })
   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка публикации отзыва',
         success: false,
         error: true
      })
   }
}

