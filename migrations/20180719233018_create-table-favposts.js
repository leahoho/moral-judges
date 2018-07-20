exports.up = function(knex, Promise) {
  return knex.schema.createTable("favposts", table => {
    table.increments();
    table.integer("user_id").unsigned();
    table.foreign("user_id").references("users.id");
    table.integer("post_id").unsigned();
    table.foreign("post_id").references("posts.id");
    table.timestamps(false, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("favposts");
};
