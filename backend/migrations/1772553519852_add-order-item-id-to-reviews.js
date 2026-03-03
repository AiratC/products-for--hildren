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
   pgm.addColumn('reviews', {
      order_item_id: {
         type: 'integer',
         // Ссылаемся на id из таблицы позиций заказа
         references: '"order_items"',
         // При удалении позиции удалится и отзыв
         onDelete: 'CASCADE',
         notNull: false,
      },
   });
   pgm.createIndex('reviews', 'order_item_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

export const down = (pgm) => {
   pgm.dropColumn('reviews', 'order_item_id');
};
