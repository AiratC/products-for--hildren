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
   pgm.sql(`
      -- Создание таблицы контакты
      CREATE TABLE Contacts (
         contact_id SERIAL PRIMARY KEY,
         name VARCHAR(300),
         phone VARCHAR(30),
         message TEXT,
         -- Соглашение на обработку данных и пользовательское соглашение
         is_agree BOOLEAN NOT NULL,
         status VARCHAR(20) DEFAULT 'new',
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
   `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
   pgm.sql(`
      DROP TABLE IF EXISTS Contacts CASCADE;
      `);
};
