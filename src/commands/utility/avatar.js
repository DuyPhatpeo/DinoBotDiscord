const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Xem avatar của một thành viên")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Người bạn muốn xem avatar")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("target") || interaction.user;

    const embed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle(`Avatar của ${user.tag}`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setFooter({ text: `ID: ${user.id}` });

    await interaction.reply({ embeds: [embed] });
  },
};
