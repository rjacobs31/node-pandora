
exports.up = function(knex, Promise) {
  return knex.table('factoid_triggers')
    .insert({'trigger': 'hi'})
    .returning('id')
    .then(ids => {
      if (ids && ids.length) {
        let trigger_id = ids[0];
        return knex.table('factoid_responses')
          .insert([
            {'trigger_id': trigger_id, 'response': 'Hi, there!'},
            {'trigger_id': trigger_id, 'response': 'Well, hello to you too.'},
            {'trigger_id': trigger_id, 'response': 'Top o\' the mornin\' to ya!'},
            {'trigger_id': trigger_id, 'response': 'Hello!'}
          ]);
      }
    });
};

exports.down = function(knex, Promise) {
  return knex.table('factoid_responses')
    .select('id')
    .where({'trigger': 'hi'})
    .then(ids => {
      if (ids && ids.length) {
        return knex.table('factoid_responses')
          .whereIn('trigger_id', ids)
          .del()
          .then(() => {
            return knex.table('factoid_triggers')
              .whereIn('id', ids)
              .del();
          });
      }
    });
};
