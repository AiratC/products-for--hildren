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
