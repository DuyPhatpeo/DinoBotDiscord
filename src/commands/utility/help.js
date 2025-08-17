const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Hiển thị danh sách lệnh"),

  async execute(interaction) {
    const { client } = interaction;

    // Gom command theo category
    const categories = {};

    client.commands.forEach((cmd) => {
      const dir = cmd.category || "Khác"; // category lấy từ loader
      if (!categories[dir]) categories[dir] = [];
      categories[dir].push({
        name: cmd.data.name,
        desc: cmd.data.description || "Không có mô tả",
      });
    });

    // Tạo embed
    const embed = new EmbedBuilder()
      .setTitle("📖 Danh sách lệnh")
      .setDescription("Dưới đây là toàn bộ lệnh mà bot hỗ trợ:")
      .setColor("#4a90e2");

    // Thêm field cho từng category
    for (const [category, commands] of Object.entries(categories)) {
      embed.addFields({
        name: `📂 ${category}`,
        value: commands.map((c) => `\`/${c.name}\` → ${c.desc}`).join("\n"),
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
