const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("baobuakeo")
    .setDescription("Chơi Oẳn Tù Tì (Bao – Búa – Kéo) với bot 🚀"),

  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("rock")
        .setLabel("✊ Búa")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("paper")
        .setLabel("✋ Bao")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("scissors")
        .setLabel("✌ Kéo")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({
      content: "👉 Chọn đi nào! Bao – Búa – Kéo:",
      components: [row],
    });
  },
};
