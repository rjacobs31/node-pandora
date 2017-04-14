let Promise = require('bluebird');

module.exports = function() {
  function stripFactoid(str) {
    if (!str) return null;

    return str.toLowerCase()
              .replace(/\b[.,!?]\s+/g, ' ')
              .replace(/[.,!?]$/, '');
  }

  function getResponse(bp, message) {
    if (message.text) {
      return bp.db.get().then(knex => {
        return knex.select('factoid_responses.response')
          .from('factoid_triggers')
          .innerJoin(
            'factoid_responses',
            'factoid_triggers.id',
            'factoid_responses.trigger_id'
          ).where({'factoid_triggers.trigger': stripFactoid(message.text)});
      });
    } else {
      return null;
    }
  }

  return {
    'getResponse': getResponse,
    'stripFactoid': stripFactoid
  };
};
