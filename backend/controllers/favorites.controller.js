import { query } from "../config/db.js";

export const toggleFavorite = async (req, res) => {
   const { productId } = req.body;
   const userId = req.userId; // Получаем из middleware проверки куки

   try {
      // 1. Проверяем, есть ли у пользователя запись в таблице Favorites
      let favorite = await query(
         `SELECT favorites_id FROM Favorites WHERE user_id = $1`,
         [userId]
      );

      let favoriteId;
      if (favorite.rows.length === 0) {
         // Если нет, создаем её
         const newFavorite = await query(
            `INSERT INTO Favorites (user_id) VALUES ($1) RETURNING favorites_id`,
            [userId]
         );
         favoriteId = newFavorite.rows[0].favorites_id;
      } else {
         favoriteId = favorite.rows[0].favorites_id
      };

      // 2. Проверяем, есть ли этот товар уже в Favorites_Items
      const itemCheck = await query(
         `SELECT * FROM Favorites_Items WHERE favorites_id = $1 AND product_id = $2`,
         [favoriteId, productId]
      );

      if (itemCheck.rows.length > 0) {
         // Если товар есть — УДАЛЯЕМ (убираем сердечко)
         await query(
            `DELETE FROM Favorites_Items WHERE favorites_id = $1 AND product_id = $2`,
            [favoriteId, productId]
         );

         return res.status(200).json({
            message: 'Удалено из избранного',
            isFavorite: false,
            productId,
            success: true,
            error: false
         })
      } else {
         // Если товара нет — ДОБАВЛЯЕМ (закрашиваем сердечко)
         await query(
            `INSERT INTO Favorites_Items (favorites_id, product_id) VALUES ($1, $2)`,
            [favoriteId, productId]
         );

         return res.status(200).json({
            message: 'Добавлено в избранное',
            isFavorite: true,
            productId,
            success: true,
            error: false
         })
      }
   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка сервера'
      })
   }
};

// Получаем все товары пользователя которые добавлены в избранное
export const getAllFavorites = async (req, res) => {
   const userId = req.userId;

   if (!userId) {
      return res.status(401).json({ message: 'Не авторизован' });
   }

   try {
      // Одним запросом получаем все товары конкретного пользователя
      const result = await query(
         `SELECT fi.product_id, fi.favorites_item_id 
         FROM Favorites_Items fi
         JOIN Favorites f ON fi.favorites_id = f.favorites_id
         WHERE f.user_id = $1`,
         [userId]
      );

      return res.status(200).json({
         success: true,
         error: false,
         // Возвращаем пустой массив, если ничего не найдено, вместо ошибки
         favoriteProducts: result.rows
      });

   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ошибка сервера' });
   }
}

