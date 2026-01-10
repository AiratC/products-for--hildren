import { v2 as cloudinary } from "cloudinary";
import { query } from "../config/db.js";

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
      const file = req.file
      console.log(`file:`, file);

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
}