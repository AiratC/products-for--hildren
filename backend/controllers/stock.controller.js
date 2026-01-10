import { v2 as cloudinary } from "cloudinary";
import { query } from "../config/db.js";

// ! Создание акции
export const addStock = async (req, res) => {
   const { title, description } = req.body;

   try {

      if (!title || !description) {
         return res.status(400).json({
            message: 'Заполните заголовок и описание',
            success: false,
            error: true
         })
      };

      // Мультер кладет данные о загруженном файле в req.file
      const file = req.file;

      if(!file) {
         return res.status(400).json({
            message: 'Изображение не загружено',
            error: true,
            success: false
         })
      };

      // Формируем структуру для базы в JSONB
      const stock_images = [{
         url: file.path, // URL в Cloudinary
         public_id: file.filename // ID для удаления в будущем
      }];

      const result = await query(
         `INSERT INTO Stock (title, description, stock_images)
         VALUES ($1, $2, $3) RETURNING *
         `,
         [title, description, JSON.stringify(stock_images)]
      );

      return res.status(201).json({
         message: 'Акция создана',
         success: true,
         error: false,
         data: result.rows[0]
      })

   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при добавлении акции на сервере',
         error: true,
         success: false
      })
   }
};

// ! Удаление акции
export const deleteStock = async (req, res) => {
   const { id } = req.params;

   try {
      // Получаем данные об акции перед удалением
      const stockResult = await query(`SELECT stock_images FROM Stock WHERE stock_id = $1`, [id]);

      if(stockResult.rowCount === 0) {
         return res.status(404).json({
            message: 'Акция не найдена',
            error: true,
            success: false
         })
      };

      const images = stockResult.rows[0].stock_images;

      // Удаляем файлы из Cloudinary
      if(images && Array.isArray(images)) {
         for(const img of images) {
            if(img.public_id) {
               await cloudinary.uploader.destroy(img.public_id)
            }
         }
      };

      // Удаляем из базы данных
      await query(`DELETE FROM Stock WHERE stock_id = $1`, [id]);

      return res.status(200).json({
         message: 'Акция успешно удалена',
         error: false,
         success: true
      })
   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при удалении акции на сервере',
         error: true,
         success: false
      })
   }
}