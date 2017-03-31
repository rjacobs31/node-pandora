let Promise = require('bluebird');

module.exports = function() {
  function getResponse(bp, message) {
    if (message.text) {
      return bp.db.get().then(knex => {
        return knex.select('factoid_responses.response')
          .from('factoid_triggers')
          .innerJoin(
            'factoid_responses',
            'factoid_triggers.id',
            'factoid_responses.trigger_id'
          ).where({'factoid_triggers.trigger': message.text.toLowerCase()});
      });
    } else {
      return null;
    }
  }

  return { 'getResponse': getResponse };
};
