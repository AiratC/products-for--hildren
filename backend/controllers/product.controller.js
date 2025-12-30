import { query } from "../config/db.js";
import { v2 as cloudinary } from 'cloudinary';

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
};

// ! Удаляем товар из БД
export const deleteProduct = async (req, res) => {
   try {
      const { id } = req.params;

      // Удаляем товар и получаем его данные (включая ссылки на фото)
      const result = await query(
         `DELETE FROM Products WHERE product_id = $1 RETURNING *`,
         [id]
      );

      if(result.rowCount === 0) {
         return res.status(404).json({
            message: 'Товар не найден',
            success: false,
            error: true
         });
      };

      const deletedProduct = result.rows[0];

      // Если у товара есть изображения, то удаляем их из cloudinary
      if (deletedProduct.product_images && deletedProduct.product_images.length > 0) {
         try {
            const deletePromises = deletedProduct.product_images.map(async (imgUrl) => {
               // Декодируем URL, чтобы вернуть кириллицу вместо %D0%....
               const decodeUrl = decodeURIComponent(imgUrl);
               // Разбираем URL: https://res.cloudinary.com/dfizqkyny/image/upload/v1767021751/products/1767021839927-%C3%90%C2%BA%C3%91%C2%80%C3%90%C2%BE%C3%90%C2%B2%C3%90%C2%B0%C3%91%C2%82%C3%90%C2%BA%C3%90%C2%B0-4.jpg
               const urlParts = decodeUrl.split('/');

               // Имя файла с расширением (последний элемент)
               const fileNameWithExtension = urlParts[urlParts.length - 1];

               // Имя папки (предпоследний элемент)
               const folderName = urlParts[urlParts.length - 2];

               // Чистый public_id без расширения (.jpg, .png и т.д)
               const publicId = fileNameWithExtension.split('.')[0];

               // Полный путь для удалния
               const fullPublicId = `${folderName}/${publicId}`;

               return cloudinary.uploader.destroy(fullPublicId);
            });

            console.log(deletePromises)
            await Promise.all(deletePromises);
            console.log('Изображения успешно удалены из Cloudinary: ', deletePromises.length)
            
         } catch (error) {
            console.error(`Ошибка при очистке Cloudinary: `, error)
         }
      }

      return res.status(200).json({
         message: 'Товар успешно удалён',
         success: true,
         error: false,
         product: result.rows[0]
      })
   } catch (error) {
      return res.status(500).json({
         message: "Ошибка на сервере при удалении товара",
         error: true,
         success: false
      })
   }
}