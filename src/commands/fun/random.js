const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Random số ngẫu nhiên từ X đến Y")
    .addIntegerOption((option) =>
      option.setName("min").setDescription("Số nhỏ nhất (X)").setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("max").setDescription("Số lớn nhất (Y)").setRequired(true)
    ),

  async execute(interaction) {
    const min = interaction.options.getInteger("min");
    const max = interaction.options.getInteger("max");

    if (min >= max) {
      return interaction.reply({
        content: "❌ Giá trị **min** phải nhỏ hơn **max**.",
        ephemeral: true,
      });
    }

    const result = Math.floor(Math.random() * (max - min + 1)) + min;

    await interaction.reply(
      `Random từ **${min}** đến **${max}** → bạn được: **${result}**`
    );
  },
};
