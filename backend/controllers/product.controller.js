import { query } from "../config/db.js";
import { v2 as cloudinary } from 'cloudinary';

// ! Создаем товар
export const createProduct = async (req, res) => {
   try {
      // Данные из FormData (текстовые поля)
      const { category_id, title, description, article, price, characteristics, is_new } =
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
            (category_id, title, description, article, price, characteristics, product_images, is_new)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
            is_new
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

      if (result.rowCount === 0) {
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
};

// ! Обновляем товар
export const updateProduct = async (req, res) => {
   try {
      const { id } = req.params;
      const { title, description, article, price, characteristics, existing_images, is_new } = req.body;

      // 1. Получаем текущие фото из БД, чтобы понять, что было удалено
      const oldProduct = await query('SELECT product_images FROM Products WHERE product_id = $1', [id]);
      const currentDbImages = oldProduct.rows[0]?.product_images || [];
      const keptImages = JSON.parse(existing_images || "[]");

      // 2. Находим фото, которые нужно удалить из Cloudinary
      const imagesToDelete = currentDbImages.filter(img => !keptImages.includes(img));

      for (const url of imagesToDelete) {
         try {
            // 1. Декодируем URL (убираем %C3%91 и т.д.)
            const decodedUrl = decodeURIComponent(url);

            // 2. Извлекаем всё, что идет ПОСЛЕ версии (v1767030536) и ДО расширения (.webp)
            // Ссылка: .../upload/v1767030536/products/filename.webp
            const regex = /\/v\d+\/(.+)\.\w+$/;
            const match = decodedUrl.match(regex);

            if (match && match[1]) {
               const publicId = match[1];
               // Теперь publicId будет "products/1767030623793-romack-синий-1"

               console.log("Попытка удаления Public ID:", publicId);
               const cloudRes = await cloudinary.uploader.destroy(publicId);
               console.log("Результат Cloudinary:", cloudRes);
            }
         } catch (err) {
            console.error("Ошибка при удалении из Cloudinary:", err);
         }
      }

      // 3. Собираем итоговый массив: старые (оставшиеся) + новые (загруженные)
      const newImages = req.files ? req.files.map(f => f.path) : [];
      const finalImages = [...keptImages, ...newImages];

      // 4. SQL запрос
      const querySql = `
         UPDATE Products 
         SET title = $1, description = $2, article = $3, price = $4, 
            characteristics = $5, product_images = $6, is_new = $7
         WHERE product_id = $8 RETURNING *`;

      const values = [title, description, article, price, characteristics, JSON.stringify(finalImages), is_new, id];
      const result = await query(querySql, values);

      return res.status(200).json({
         success: true,
         error: false,
         product: result.rows[0]
      });

   } catch (error) {
      return res.status(500).json({
         success: false,
         error: true,
         message: error.message
      });
   }
};

// !!! Получаем товары с фильтрацией
export const getProductsByFilters = async (req, res) => {
   const { slug, page = 1, minPrice, maxPrice, ...filters } = req.query;

   const limit = 4;
   const offset = (page - 1) * limit;

   try {
      // 1. Сначала проверяем, есть ли такая категория и берём её конфиг фильтров
      const categoryRes = await query(`SELECT category_id, filter_config FROM Categories WHERE slug = $1`, [slug]);

      if(categoryRes.rows.length === 0) {
         return res.status(404).json({
            success: false,
            message: 'Категория не найдена'
         });
      };

      const { category_id, filter_config } = categoryRes.rows[0];

      // 2. Формируем условия для товаров
      let whereClauses = ['category_id = $1'];
      let params = [category_id];

      // Фильтр цены
      if(minPrice) {
         params.push(minPrice);
         whereClauses.push(`price >= $${params.length}`);
      };

      if(maxPrice) {
         params.push(maxPrice);
         whereClauses.push(`price <= $${params.length}`);
      };

      // Динамические фильтры (характеристики);
      Object.entries(filters).forEach(([key, value]) => {
         if(value && value !== 'undefined') {
            const valuesArray = value.split(',');
            params.push(valuesArray);
            whereClauses.push(`characteristics->>'${key}' = ANY($${params.length})`);
         }
      });

      const whereSql = whereClauses.join(" AND ");

      // Получаем товары и общее кол-во для пагинации
      const products = await query(
         `SELECT * FROM Products WHERE ${whereSql} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
         params
      );
      const countResult = await query(
         `SELECT COUNT(*) FROM products WHERE ${whereSql}`,
         params
      );

      return res.status(200).json({
         success: true,
         products: products.rows,
         total: parseInt(countResult.rows[0].count),
         pages: Math.ceil(countResult.rows[0].count / limit),
         filterConfig: filter_config
      })
   } catch (error) {
      console.log(error)
      return res.status(500).json({
         success: false,
         message: 'Ошибка при получении товаров с фильтрацией'
      })
   }
}