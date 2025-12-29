import { query } from "../config/db.js";

// ! Создаем товар
export const createProduct = async (req, res) => {
   try {
      // Данные из FormData (текстовые поля)
      const { category_id, title, description, article, price, characteristics } =
         req.body;

      // Если характеристики УЖЕ строка (из FormData), оставляем её.
      // Если это вдруг объект (например, тестируешь через Postman JSON), превращаем в строку.
      const characteristicsForDb =
         typeof characteristics === "string"
            ? characteristics
            : JSON.stringify(characteristics || {});

      // Аналогично для массива изображений из Cloudinary
      const imageUrls = req.files ? req.files.map(file => file.path) : [];
      const imagesForDb = JSON.stringify(imageUrls);

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
            description || "",
            article,
            price,
            characteristicsForDb,
            imagesForDb,
         ]
      );

      return res.status(201).json({
         message: "Товар успешно создан",
         success: true,
         error: false,
         product: result.rows[0],
      });
   } catch (error) {
      return res.status(500).json({
         message: "Ошибка на сервере при создании товара",
         error: true,
         success: false,
      });
   }
};

// ! Получаем товары конкретной категории
export const getProductsByCategory = async (req, res) => {
   try {
      const { id } = req.params; // id категории из URL

      const result = await query(
         `SELECT * FROM Products WHERE category_id = $1 ORDER BY product_id DESC`,
         [id]
      );

      return res.status(200).json({
         success: true,
         error: false,
         products: result.rows
      })
   } catch (error) {
      console.log(error)
      return res.status(500).json({
         message: 'Ошибка на сервере при получении товаров',
         error: true,
         success: false
      })
   }
}