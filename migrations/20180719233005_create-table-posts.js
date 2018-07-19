
exports.up = function(knex, Promise) {
    return knex.schema.createTable('posts', (table) => {
        table.increments();
        table.integer("user_id").unsigned();
        table.foreign("user_id").references('users.id');
        table.string("image_path");
        table.boolean("victim");
        table.string("title");
        table.dateTime("datetime");
        table.text("content");
        table.timestamps(false, true);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('posts');
};
