module.exports = function(bp) {
  bp.middlewares.load()

  bp.hear({platform: "discord", type: "text", text: /^pandora:/i}, event => {
    bp.discord.sendText(event.channel.id, "Bananas!")
  })
}
