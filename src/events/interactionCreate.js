module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    // Slash Command
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        console.error(`No command matching ${interaction.commandName}`);
        return;
      }
      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(err);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "Có lỗi xảy ra khi chạy lệnh.",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "Có lỗi xảy ra khi chạy lệnh.",
            ephemeral: true,
          });
        }
      }
    }

    // Button Interaction (dùng cho poll, confirm, vv)
    if (interaction.isButton()) {
      // Poll
      if (interaction.customId.startsWith("poll_")) {
        const choice = interaction.customId.split("_")[1];
        return interaction.reply({
          content: `🗳️ ${interaction.user} đã chọn **Lựa chọn ${choice}**`,
          ephemeral: true,
        });
      }

      // Các button khác bạn thêm xử lý ở đây
    }

    // Select Menu Interaction (nếu bạn muốn sau này dùng dropdown)
    if (interaction.isStringSelectMenu()) {
      // Ví dụ xử lý select menu
      console.log(`${interaction.user.tag} chọn: ${interaction.values}`);
      await interaction.reply({
        content: `Bạn đã chọn: ${interaction.values.join(", ")}`,
        ephemeral: true,
      });
    }
  },
};
