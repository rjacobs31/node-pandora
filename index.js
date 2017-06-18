module.exports = function(bp) {
  let factoids = require('./db/factoids')(bp);
  const addressRegex = /^pan(dora)?:\s*/i;
  bp.middlewares.load();

  bp.hear({platform: 'discord', text: /banana/i}, (event, next) => {
    bp.discord.raw.addMessageReaction(event.channel.id, event.raw.id, '\u{1f60d}');
    next();
  });

  bp.hear({platform: 'discord', text: addressRegex}, event => {
    const reIs = /\s+is\s+/;
    const reIsReply = /\s+is\s+[<]reply[>]/;
    const reIsAction = /\s+is\s+[<]action[>]\s*/;

    let command = event.text.replace(addressRegex, '');
    let triggerStopIdx = command.search(reIs);

    if (triggerStopIdx > 0) {
      let newTrigger;
      let newResponse;

      if (command.search(reIsReply) >= 0) {
        triggerStopIdx = command.search(reIsReply);
        newTrigger = factoids.stripFactoid(command.slice(0, triggerStopIdx));
        newResponse = command.substring(triggerStopIdx).replace(reIsReply, '');
      } else if (command.search(reIsAction) >= 0) {
        triggerStopIdx = command.search(reIsAction);
        newTrigger = factoids.stripFactoid(command.slice(0, triggerStopIdx));
        newResponse = command.substring(triggerStopIdx).replace(reIsAction, '/me ');
      } else {
        newTrigger = factoids.stripFactoid(command.slice(0, triggerStopIdx));
        newResponse = command;
      }

      if (!newTrigger && !newResponse) {
        bp.discord.sendText(event.channel.id, 'Sorry, empty trigger and response not allowed.');
        return;
      } else if (!newTrigger) {
        bp.discord.sendText(event.channel.id, 'Sorry, empty trigger not allowed.');
        return;
      } else if (!newResponse) {
        bp.discord.sendText(event.channel.id, 'Sorry, empty response not allowed.');
        return;
      }

      factoids.addFactoid(bp, newTrigger, newResponse)
        .catch(() => {
          bp.discord.sendText(event.channel.id, 'Sorry, I couldn\'t process that factoid.');
        })
        .then(() => {
          bp.discord.sendText(
            event.channel.id,
            'Okay, remembering that "' + newTrigger + '" is "' + newResponse + '"');
        });
    } else {
      bp.discord.sendText(event.channel.id, 'Sorry, I don\'t understand.');
    }
  });

  bp.hear({platform: 'discord'}, event => {
    if (event.text) {
      factoids.getResponse(bp, event)
      .then(response => {
        if (response) {
          bp.discord.sendText(event.channel.id, response);
        }
      });
    }
  });
};
