exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', table => {
    table.increments();
    table
      .string('username')
      .unique()
      .notNullable();
    table.string('password').notNullable();
    table.string('email');
    table.timestamps(false, true);
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
