exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table.increments();
    table.string("email").notNullable();
    table.string("name", 20).notNullable();
    table.string("password").notNullable();
    table.boolean("confirmed").defaultTo(false);
    table.integer("token_version").defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
