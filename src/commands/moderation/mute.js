const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Tắt tiếng (timeout) thành viên")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Thành viên cần mute")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("minutes").setDescription("Số phút mute").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Lý do mute").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const minutes = interaction.options.getInteger("minutes");
    const reason = interaction.options.getString("reason") || "Không có lý do";
    const member = interaction.guild.members.cache.get(target.id);

    if (!member.moderatable) {
      return interaction.reply({
        content: "❌ Không thể mute thành viên này!",
        ephemeral: true,
      });
    }

    const duration = minutes * 60 * 1000;
    await member.timeout(duration, reason);

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle("🔇 Thành viên đã bị MUTE")
      .setDescription(
        `**Người bị mute:** ${target}\n**Thời gian:** ${minutes} phút\n**Lý do:** ${reason}\n**Người thực hiện:** ${interaction.user}`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
