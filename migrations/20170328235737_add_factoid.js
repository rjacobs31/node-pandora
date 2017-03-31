
exports.up = function(knex, Promise) {
  knex.schema.createTableIfNotExists('factoid_triggers', function(table) {
    table.increments();
    table.string('trigger');
    table.timestamps();
  });

  knex.schema.createTableIfNotExists('factoid_responses', function(table) {
    table.increments();
    table.integer('trigger_id').unsigned();
    table.foreign('trigger_id').references('id').inTable('factoid_triggers');
    table.text('response');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTableIfExists('factoid_responses');
  knex.schema.dropTableIfExists('factoid_triggers');
};
