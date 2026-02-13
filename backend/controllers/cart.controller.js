import { query } from "../config/db.js";

export const updateCartItem = async (req, res) => {
   const { productId, action } = req.body;
   const userId = req.userId;

   try {
      // Находим или создаем корзину
      let cart = await query(
         `SELECT cart_id FROM Cart WHERE user_id = $1`,
         [userId]
      );
      let cartId = cart.rows[0]?.cart_id;

      if(!cartId) {
         const newCart = await query(`INSERT INTO Cart (user_id) VALUES ($1) RETURNING cart_id`, [userId]);
         cartId = newCart.rows[0].cart_id;
      };

      // Проверяем товар в корзине
      const item = await query(`SELECT * FROM Cart_items WHERE cart_id = $1 AND product_id = $2`, [cartId, productId]);

      if(item.rows.length > 0) {
         let newQty = item.rows[0].quantity;
         if(action === 'increment' || action === 'add') newQty++;
         if(action === 'decrement') newQty--;

         if(newQty <= 0) {
            await query(`DELETE FROM Cart_items WHERE cart_id = $1 AND product_id = $2`, [cartId, productId]);
            return res.status(200).json({
               message: 'Удален',
               productId,
               quantity: 0
            });
         } else {
            await query(
               `UPDATE Cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3`,
               [newQty, cartId, productId]
            );
            return res.status(200).json({
               productId,
               quantity: newQty,
               message: 'Обновлен'
            })
         }
      } else {
         await query(
            `
            INSERT INTO Cart_items (cart_id, product_id, quantity)
            VALUES ($1, $2, 1)
            `,
            [cartId, productId]
         );
         return res.status(200).json({
            productId,
            quantity: 1,
            message: 'Добавлен'
         })
      }

   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при обновлении товара в корзине на сервере'
      })
   }
};


// Получаем { productId, quantity } после перезагрузки страницы
export const getFetchCartItems = async (req, res) => {
   const userId = req.userId;

   try {
      const result = await query(
         `
         SELECT ci.product_id, ci.quantity 
         FROM Cart c
         INNER JOIN Cart_items ci ON c.cart_id = ci.cart_id
         WHERE c.user_id = $1
         `,
         [userId]
      );

      return res.status(200).json({
         cartItems: result.rows
      })
   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка на сервере'
      })
   }
}