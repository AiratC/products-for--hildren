/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
   pgm.sql(
      `
      -- Таблица каталог
      CREATE TABLE Catalog (
         catalog_id SERIAL PRIMARY KEY,
         name VARCHAR(150)
      );

      -- Сразу добавляем в каталог данные
      INSERT INTO Catalog (name) 
      VALUES 
         ('Акции'), ('Детская мебель'), ('Коляски'), ('Автокресла'), 
         ('Одежда'), ('Кормление'), ('Гигиена и уход'), ('Умные игрушки');

      -- Таблица категории
      CREATE TABLE Categories (
         category_id SERIAL PRIMARY KEY,
         catalog_id INT REFERENCES Catalog(catalog_id) ON DELETE CASCADE NOT NULL,
         name VARCHAR(400),
         filter_config JSONB DEFAULT '[]'
      );

      -- Создание таблицы товаров
      CREATE TABLE Products (
         product_id SERIAL PRIMARY KEY,
         category_id INT REFERENCES Categories(category_id) ON DELETE CASCADE NOT NULL,
         title VARCHAR(500) NOT NULL,
         -- Артикул товара
         article VARCHAR(100) DEFAULT NULL,
         description TEXT,
         price DECIMAL(10, 2) NOT NULL,
         old_price DECIMAL(10, 2) DEFAULT NULL,
         -- Характеристики
         characteristics JSONB DEFAULT '{}',
         product_images JSONB DEFAULT '[]',
         is_new BOOLEAN DEFAULT FALSE,
         is_popular BOOLEAN DEFAULT FALSE,
         is_on_sale BOOLEAN DEFAULT FALSE,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      `
   )
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
   pgm.sql(`
      DROP TABLE IF EXISTS Products CASCADE;
      DROP TABLE IF EXISTS Categories CASCADE;
      DROP TABLE IF EXISTS Catalog CASCADE;
   `);
};
