module.exports = function(bp) {
  let factoids = require('./db/factoids')(bp);
  bp.middlewares.load();

  bp.hear({platform: "discord", text: /^pandora:/i}, event => {
    bp.discord.sendText(event.channel.id, "Bananas!");
  });

  bp.hear({platform: "discord"}, event => {
    factoids.getResponse(bp, event)
    .then(responses => {
      if (responses && responses.length > 0) {
        let idx = Math.floor(Math.random()*(responses.length + 1));
        if ('response' in responses[idx]) {
          bp.discord.sendText(event.channel.id, responses[idx].response);
        }
      }
    });
  });
};
