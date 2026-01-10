import { v2 as cloudinary } from "cloudinary";
import { query } from "../config/db.js";

// ! Создание блога
export const addBlog = async (req, res) => {
   const { blog_title, description } = req.body;

   try {

      if (!blog_title || !description) {
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
      const blog_images = [{
         url: file.path, // URL в Cloudinary
         public_id: file.filename // ID для удаления в будущем
      }];

      const result = await query(
         `INSERT INTO Blogs (blog_title, description, blog_images)
         VALUES ($1, $2, $3) RETURNING *
         `,
         [blog_title, description, JSON.stringify(blog_images)]
      );

      return res.status(201).json({
         message: 'Блог создан',
         success: true,
         error: false,
         data: result.rows[0]
      })

   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при добавлении блога на сервере',
         error: true,
         success: false
      })
   }
};

// ! Удаление блога
export const deleteBlog = async (req, res) => {
   const { id } = req.params;

   try {
      // Получаем данные об акции перед удалением
      const blogResult = await query(`SELECT blog_images FROM Blogs WHERE blog_id = $1`, [id]);

      if(blogResult.rowCount === 0) {
         return res.status(404).json({
            message: 'Блог не найден',
            error: true,
            success: false
         })
      };

      const images = blogResult.rows[0].blog_images;

      // Удаляем файлы из Cloudinary
      if(images && Array.isArray(images)) {
         for(const img of images) {
            if(img.public_id) {
               await cloudinary.uploader.destroy(img.public_id)
            }
         }
      };

      // Удаляем из базы данных
      await query(`DELETE FROM Blogs WHERE blog_id = $1`, [id]);

      return res.status(200).json({
         message: 'Блог успешно удален',
         error: false,
         success: true
      })
   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при удалении блога на сервере',
         error: true,
         success: false
      })
   }
};

// ! Получаем все блоги
export const getAllBlogs = async (req, res) => {
   try {
      // Получаем страницу
      const page = parseInt(req.query.page) || 1;
      // Получаем лимит
      const limit = parseInt(req.query.limit) || 12;
      // Смещение
      const offset = (page - 1) * limit;

      const result = await query(
         `SELECT * FROM Blogs ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
         [limit, offset]
      );

      // Получаем общее кол-во для пагинации на фронте
      const countResult = await query(`SELECT COUNT(*) FROM Blogs`);
      const totalBlogs = parseInt(countResult.rows[0].count);

      return res.status(200).json({
         success: true,
         error: false,
         blogs: result.rows || [],
         total: totalBlogs,
         currentPage: page,
         totalBlogs: Math.ceil(totalBlogs / limit)

      })
   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при получении блогов на сервере',
         error: true,
         success: false
      })
   }
}