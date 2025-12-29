import { query } from "../config/db.js";

// ! Создаем товар
export const createProduct = async (req, res) => {
   try {
      const { category_id, title, description, article, price, characteristics, product_images } = req.body;

      const result = await query(
         `
            INSERT INTO Products 
            (category_id, title, description, article, price, characteristics, product_images)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
         `,
         [
            Number(category_id), 
            title, 
            description || '', 
            article, 
            price, 
            JSON.stringify(characteristics || {}), 
            JSON.stringify(product_images || [])
         ]
      );

      return res.status(201).json({
         message: 'Товар успешно создан',
         success: true,
         error: false,
         product: result.rows[0]
      })
   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка на сервере при создании товара',
         error: true,
         success: false
      })
   }
}