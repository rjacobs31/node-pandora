const Promise = require('bluebird');
const strings = require('../utils/strings');
const _ = require('lodash');

module.exports = function() {
  /**
   * Strips factoid trigger text of undesired punctuation.
   *
   * Will leave mid-word punctuation intact, e.g. "murder.exe".
   *
   * @param str The text to be processed.
   */
  function stripFactoid(str) {
    if (!str) return null;

    return str.toLowerCase()
              .replace(/\b[.,!?]\s+/g, ' ')
              .replace(/^\s+|\s+$/g, '')
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
      })
      .then(responses => {
        if (responses && responses.length > 0) {
          let replacer = {
            who: `<@${message.user.id}>`,
            someone: _.once(() => {
              if ('raw' in bp.discord) {
                if ('recipients' in message.channel) {
                  let user = _.sample(message.channel.recipients);
                  return `<@${user.id}>`;
                } else if ('guild' in message.channel) {
                  let user = _.sample(message.channel.guild.members);
                  return `<@${user.id}>`;
                } else {
                  return 'someone';
                }
              } else {
                return 'someone';
              }
            })
          };
          let response = _.sample(responses).response;
          return Promise.resolve(strings.stringTemplateReplace(response, replacer));
        } else {
          return Promise.resolve(null);
        }
      });
    }
  }

  /**
   * Adds a new factoid trigger to the database.
   *
   * @param bp          A Botpress instance.
   * @param newTrigger  The processed text of the new trigger to insert.
   */
  function addFactoidTrigger(bp, newTrigger) {
    return bp.db.get().then(knex => {
      return knex('factoid_triggers')
        .insert({'trigger': newTrigger}, 'id');
    });
  }

  /**
   * Adds a new factoid response to the database.
   *
   * @param bp          A Botpress instance.
   * @param triggerId   The ID of the trigger to link to.
   * @param newResponse The text of the new response to insert.
   */
  function addFactoidResponse(bp, triggerId, newResponse) {
    return bp.db.get().then(knex => {
      return knex('factoid_responses')
        .insert({'trigger_id': triggerId, 'response': newResponse}, 'id');
    });
  }

  function addFactoid(bp, newTrigger, newResponse) {
    return bp.db.get().then(knex => {
      let oldIdPromise = knex.select('id')
        .from('factoid_triggers')
        .where({'trigger': newTrigger});

      return oldIdPromise.then(data => {
        if (data && data.length > 0) {
          let id = data[0].id;
          return addFactoidResponse(bp, id, newResponse);
        } else {
          return addFactoidTrigger(bp, newTrigger)
            .then(data => {
              return addFactoidResponse(bp, data[0], newResponse);
            });
        }
      });
    });
  }

  return {
    'getResponse': getResponse,
    'addFactoid': addFactoid,
    'stripFactoid': stripFactoid
  };
};
