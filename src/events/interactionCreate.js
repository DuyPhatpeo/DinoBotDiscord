// src/events/interactionCreate.js
module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
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
  },
};
