const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addrole")
    .setDescription("Cấp role cho một thành viên")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Thành viên nhận role")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option.setName("role").setDescription("Role cần cấp").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const target = interaction.options.getMember("target");
    const role = interaction.options.getRole("role");

    // Kiểm tra bot có quyền ManageRoles
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ManageRoles
      )
    ) {
      return interaction.reply({
        content: "❌ Bot không có quyền quản lý role!",
        ephemeral: true,
      });
    }

    // Kiểm tra role có thể được gán (role của bot phải cao hơn)
    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({
        content:
          "❌ Không thể cấp role này vì role của bot thấp hơn hoặc bằng role cần cấp!",
        ephemeral: true,
      });
    }

    // Kiểm tra thành viên đã có role chưa
    const memberHighestRole = target.roles.highest;
    const everyoneRoleId = interaction.guild.id;

    if (
      memberHighestRole.id !== everyoneRoleId &&
      role.position >= memberHighestRole.position
    ) {
      return interaction.reply({
        content:
          "❌ Không thể cấp role này cho thành viên vì role cao hơn hoặc bằng role hiện tại của họ!",
        ephemeral: true,
      });
    }

    try {
      await target.roles.add(role);

      const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("✅ Role đã được cấp")
        .setDescription(
          `**Thành viên:** ${target}\n**Role:** ${role}\n**Người thực hiện:** ${interaction.user}`
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "❌ Có lỗi xảy ra khi cấp role!",
        ephemeral: true,
      });
    }
  },
};
