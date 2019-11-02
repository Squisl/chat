exports.up = function(knex) {
  return knex.schema.createTable("channels", table => {
    table.increments();
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .notNullable();
    table
      .string("name")
      .unique()
      .notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("channels");
};
