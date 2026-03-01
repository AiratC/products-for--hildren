import { query } from "../config/db.js";

// ! Создаем категорию
export const createCategory = async (req, res) => {
   try {
      const { name, catalog_id, filter_config, slug } = req.body;

      if (!name || !catalog_id || !slug) {
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
      if (error.code === '23503') {
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

      if (result.rows.length === 0) {
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
};

// Получаем данные и по категории
export const getCategoryPageData = async (req, res) => {
   const { slug } = req.params;
   let { category_id } = req.query;
   const page = parseInt(req.query.page) || 1;
   const limit = 2;
   const offset = (page - 1) * limit;

   // Если пришла строка "null", неопределенность или пустая строка — ставим честный null
   if (category_id === 'null' || category_id === 'undefined' || !category_id) {
      category_id = null;
   }

   try {
      // Запускаем оба запроса параллельно
      const [metaResult, productResult] = await Promise.all([
         // 1. Запрос мета-данных (название каталога и все категории для сайдбара)
         query(
            `
               SELECT c.name as catalog_name,
               (SELECT json_agg(json_build_object('id', cat.category_id, 'name', cat.name))
                  FROM categories cat WHERE cat.catalog_id = c.catalog_id) as side_categories
               FROM catalog c WHERE c.slug = $1
            `, [slug]
         ),
         // 2. Запрос товаров с пагинацией и фильтром
         query(
            `
               SELECT p.*, cat.name as category_name, COUNT(*) OVER() as total_count
                  FROM products p
                  JOIN categories cat ON p.category_id = cat.category_id
                  JOIN catalog c ON cat.catalog_id = c.catalog_id
                  WHERE c.slug = $1 AND ($2::int IS NULL OR cat.category_id = $2)
                  ORDER BY p.created_at DESC
                  LIMIT $3 OFFSET $4
            `, [slug, category_id || null, limit, offset]
         )
      ]);

      // Исправляем: берем total_count из первой строки, если она есть
      // Если товаров нет, ставим 0
      const totalCount = productResult.rows.length > 0 
         ? parseInt(productResult.rows[0].total_count) 
         : 0;

      return res.status(200).json({
         catalog_name: metaResult.rows[0]?.catalog_name,
         side_categories: metaResult.rows[0]?.side_categories || [],
         products: productResult.rows,
         total_count: productResult.rows[0]?.total_count || 0,
         current_page: page,
         totalPages: Math.ceil(totalCount / limit)

      });

   } catch (error) {
      console.error(error);
      return res.status(500).json({
         message: 'Ошибка на сервере'
      })
   }
};

