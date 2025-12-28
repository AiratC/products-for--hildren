import { query } from "../config/db.js";

// ! Получаем структуру меню
export const getMenuStructure = async (req, res) => {
   try {
      // Получаем все разделы верхнего уровня (Каталог)
      const catalogResult = await query(`SELECT * FROM catalog ORDER BY catalog_id`);
      // Получаем все подкатегории (Детская мебель -> Кроватки и т.д)
      const categoriesResult = await query(`SELECT * FROM categories ORDER BY name`);
      
      // Формируем структуру для Ant Design
      const menu = catalogResult.rows.map(cat => ({
         key: `catalog-${cat.catalog_id}`,
         label: cat.name,
         // Фильтруем категории, которые относятся к этому разделу каталога
         children: categoriesResult.rows
         .filter(sub => sub.catalog_id === cat.catalog_id).map(sub => ({
            key: `category-${sub.category_id}`,
            label: sub.name
         }))
      }));

      return res.status(200).json(menu);

   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при получении меню на сервере',
         error: true,
         success: false
      })
   }
}

// ! Получаем каталог
export const getAllCatalog = async (req, res) => {
   try {
      const result = await query(`SELECT * FROM Catalog ORDER BY name ASC`);
      
      return res.status(200).json({
         message: 'Каталог получен',
         error: false,
         success: true,
         catalog: result.rows
      });
   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при получении каталога на сервере',
         error: true,
         success: false
      });
   };
};

