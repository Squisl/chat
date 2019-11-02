exports.up = function(knex) {
  return knex.schema.createTable("messages", table => {
    table.increments();
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .notNullable();
    table
      .integer("channel_id")
      .references("id")
      .inTable("channels")
      .notNullable();
    table.string("text").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("messages");
};
