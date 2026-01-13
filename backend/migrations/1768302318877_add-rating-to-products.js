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
   pgm.addColumns('products', {
      rating: {
         type: 'numeric(2,1)',
         default: 0,
         ifNotExists: true
      },
      reviews_count: {
         type: 'integer',
         default: 0,
         ifNotExists: true
      }
   })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
   pgm.dropColumns('products', ['rating', 'reviews_count']);
};
