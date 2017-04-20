module.exports = function(bp) {
  let factoids = require('./db/factoids')(bp);
  const addressRegex = /^pan(dora)?:\s*/i;
  bp.middlewares.load();

  bp.hear({platform: 'discord', text: addressRegex}, event => {
    const reIs = /\s+is\s+/;
    const reIsReply = /\s+is\s+[<]reply[>]/;

    let command = event.text.replace(addressRegex, '');
    let triggerStopIdx = command.search(reIs);

    if (triggerStopIdx > 0) {
      let newTrigger;
      let newResponse;

      if (command.search(reIsReply) >= 0) {
        newTrigger = factoids.stripFactoid(command.slice(0, triggerStopIdx));
        newResponse = command.substring(triggerStopIdx).replace(reIsReply, '');
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
    factoids.getResponse(bp, event)
    .then(responses => {
      if (responses && responses.length > 0) {
        let idx = Math.floor(Math.random()*(responses.length));
        if ('response' in responses[idx]) {
          bp.discord.sendText(event.channel.id, responses[idx].response);
        }
      }
    });
  });
};
