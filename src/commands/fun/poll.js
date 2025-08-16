const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Tạo một cuộc khảo sát với nhiều lựa chọn")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Câu hỏi cho poll")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("option1").setDescription("Lựa chọn 1").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("option2").setDescription("Lựa chọn 2").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("option3").setDescription("Lựa chọn 3").setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("option4").setDescription("Lựa chọn 4").setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("option5").setDescription("Lựa chọn 5").setRequired(false)
    ),

  async execute(interaction) {
    const question = interaction.options.getString("question");
    const options = [];
    for (let i = 1; i <= 5; i++) {
      const opt = interaction.options.getString(`option${i}`);
      if (opt) options.push(opt);
    }

    if (options.length < 2) {
      return interaction.reply({
        content: "❌ Bạn cần ít nhất 2 lựa chọn để tạo poll.",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0xffd700)
      .setTitle("📊 Cuộc Khảo Sát")
      .setDescription(
        `**${question}**\n\n${options
          .map((opt, i) => `**${i + 1}.** ${opt}`)
          .join("\n")}`
      )
      .setFooter({
        text: `Tạo bởi ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    const row = new ActionRowBuilder();
    options.forEach((opt, i) => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`poll_${i + 1}`)
          .setLabel(`${i + 1}. ${opt}`)
          .setStyle(ButtonStyle.Primary)
      );
    });

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
