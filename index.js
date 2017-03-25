module.exports = function(bp) {
  bp.middlewares.load()

  bp.hear({platform: "discord", text: /^pandora:/i}, event => {
    bp.discord.sendText(event.channel.id, "Bananas!")
  })
}
