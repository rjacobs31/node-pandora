module.exports = function(bp) {
  let factoids = require('./db/factoids')(bp);
  let addressRegex = /^pan(dora)?:\s*/i;
  bp.middlewares.load();

  bp.hear({platform: 'discord', text: addressRegex}, event => {
    let command = event.text.replace(addressRegex, '');
    let reIs = /\s+is\s+/;
    let triggerStopIdx = command.search(reIs);
    if (triggerStopIdx > 0) {
      let newTrigger = factoids.stripFactoid(command.slice(0, triggerStopIdx));
      let newResponse = command;
      bp.discord.sendText(
        event.channel.id,
        'I detected an "is" command.\n' +
        '```Trigger: ' + newTrigger + '```\n' +
        '```Response: ' + newResponse + '```');
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
