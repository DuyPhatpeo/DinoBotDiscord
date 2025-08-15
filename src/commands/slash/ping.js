const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Kiểm tra độ trễ của bot"),
  async execute(interaction) {
    const wsPing = interaction.client.ws.ping;

    // Tạo embed
    const embed = new EmbedBuilder()
      .setColor(0x2ec99d)
      .setTitle("🏓 Pong!")
      .setDescription(`Ping hiện tại của bot: **${wsPing}ms**`)
      .setFooter({ text: `Requested by ${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  },
};
