const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Bot sẽ chào lại người dùng")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Nội dung bot sẽ nói")
        .setRequired(true)
    ),
  async execute(interaction) {
    const message = interaction.options.getString("message");

    // Tạo embed để trả về
    const embed = new EmbedBuilder()
      .setColor(0x2ec99d)
      .setTitle("📢 Say Command")
      .setDescription(`${message} <@${interaction.user.id}>`);

    await interaction.reply({ embeds: [embed] });
  },
};
