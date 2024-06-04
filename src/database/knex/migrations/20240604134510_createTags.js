exports.up = knex =>
  knex.schema.createTable("tags", table => {
    table.increments("id");
    table.string("name");
    table
      .integer("note_id")
      .references("id")
      .inTable("notes")
      .onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

exports.down = knex => knex.schema.dropTable("tags");
