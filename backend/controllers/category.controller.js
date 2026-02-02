import { query } from "../config/db.js";

// ! Создаем категорию
export const createCategory = async (req, res) => {
   try {
      const { name, catalog_id, filter_config, slug } = req.body;

      if(!name || !catalog_id || !slug) {
         return res.status(400).json({
            message: 'Название, ID каталога, slug обязательны',
            error: true,
            success: false
         })
      }

      // JSONB в Postgres отлично принимает массивы напрямую из JS
      const result = await query(
         `INSERT INTO Categories (catalog_id, name, filter_config, slug) VALUES ($1, $2, $3, $4) RETURNING *`,
         [Number(catalog_id), name, JSON.stringify(filter_config || []), slug]
      );

      return res.status(201).json({
         message: `Категория ${name} создана`,
         success: true,
         error: false,
         category: result.rows[0]
      })
   } catch (error) {
      // Обработка специфической ошибки Postgres (например, если каталог с таким ID не существует)
      if(error.code === '23503') {
         return res.status(400).json({
            message: 'Указанный раздел каталога не существует',
            error: true,
            success: false
         })
      }

      return res.status(500).json({
         message: 'Ошибка на сервере при создании категории',
         error: true,
         success: false
      })
   }
}

// ! Получаем все категории
export const getAllCategories = async (req, res) => {
   try {
      const result = await query(
         `
            SELECT
               c.*,
               cat.name AS catalog_name
            FROM Categories c
            LEFT JOIN Catalog cat ON c.catalog_id = cat.catalog_id
            ORDER BY c.category_id DESC
         `
      );

      return res.status(200).json({
         message: 'Все категории получены',
         error: false,
         success: true,
         categories: result.rows
      })
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         message: 'Ошибка при получении всех категорий на сервере',
         error: true,
         success: false
      })
   }
}

// !!! Получаем все категории конкретного каталога по catalog_id
export const getCategoriesByCatalogId = async (req, res) => {
   const { catalogId } = req.body;

   try {
      const result = await query(
         `SELECT * FROM Categories WHERE catalog_id = $1`,
         [catalogId]
      );

      if(result.rows.length === 0) {
         return res.status(200).json({
            message: 'Нет категорий в данном каталоге',
            error: true,
            success: false
         })
      }

      return res.status(200).json({
         success: true,
         error: false,
         categories: result.rows
      });

   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при получении всех категорий по каталог id на сервере',
         error: true,
         success: false
      })
   }
}

