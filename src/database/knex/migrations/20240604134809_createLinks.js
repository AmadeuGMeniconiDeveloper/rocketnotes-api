exports.up = knex =>
  knex.schema.createTable("links", table => {
    table.increments("id");
    table.string("url");

    table
      .integer("note_id")
      .references("id")
      .inTable("notes")
      .onDelete("CASCADE");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

exports.down = knex => knex.schema.dropTable("links");
