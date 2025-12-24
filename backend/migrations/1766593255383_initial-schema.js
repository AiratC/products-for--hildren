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
      CREATE TYPE user_role_type AS ENUM ('Админ', 'Пользователь', 'Гость');

      -- Создание таблицы ролей
      CREATE TABLE Roles (
         role_id SERIAL PRIMARY KEY,
         name user_role_type NOT NULL UNIQUE
      );

      -- Вставка базовых ролей ('Админ'), ('Пользователь'), ('Гость')
      INSERT INTO Roles (name)
      VALUES ('Админ'), ('Пользователь'), ('Гость');

      -- Создание таблицы пользователей
      CREATE TABLE Users (
         user_id SERIAL PRIMARY KEY,
         role_id INT REFERENCES Roles(role_id) ON DELETE SET DEFAULT NOT NULL DEFAULT 2,
         name VARCHAR(255),
         email VARCHAR(250) UNIQUE NOT NULL,
         password_hash VARCHAR(255) NOT NULL,
         delivery_address VARCHAR(350) DEFAULT NULL,
         phone VARCHAR(30) UNIQUE,
         avatar TEXT DEFAULT NULL,
         reset_password_token VARCHAR(255),
         reset_password_expires TIMESTAMP WITHOUT TIME ZONE,
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
      DROP TABLE Users;
      DROP TABLE Roles;
      DROP TYPE user_role_type;
   `);
};
