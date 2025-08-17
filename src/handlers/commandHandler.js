module.exports.handleCommand = async (interaction) => {
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`❌ Không tìm thấy command: ${interaction.commandName}`);
    return;
  }
  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    const replyMsg = {
      content: "⚠️ Có lỗi xảy ra khi chạy lệnh.",
      ephemeral: true,
    };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(replyMsg);
    } else {
      await interaction.reply(replyMsg);
    }
  }
};
