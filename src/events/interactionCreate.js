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

    // Button Interaction (poll, oẳn tù tì, vv)
    if (interaction.isButton()) {
      // Poll
      if (interaction.customId.startsWith("poll_")) {
        const choice = interaction.customId.split("_")[1];
        return interaction.reply({
          content: `🗳️ ${interaction.user} đã chọn **Lựa chọn ${choice}**`,
          ephemeral: true,
        });
      }

      // Bao – Búa – Kéo
      if (["rock", "paper", "scissors"].includes(interaction.customId)) {
        const userChoice = interaction.customId;
        const choices = ["rock", "paper", "scissors"];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        let result = "";
        if (userChoice === botChoice) {
          result = "⚖️ Hòa nhau!";
        } else if (
          (userChoice === "rock" && botChoice === "scissors") ||
          (userChoice === "paper" && botChoice === "rock") ||
          (userChoice === "scissors" && botChoice === "paper")
        ) {
          result = "🎉 Bạn thắng!";
        } else {
          result = "😢 Bot thắng!";
        }

        return interaction.update({
          content: `🫵 Bạn chọn: **${icon(userChoice)}**\n🤖 Bot chọn: **${icon(
            botChoice
          )}**\n\n👉 ${result}`,
          components: [], // Xoá nút sau khi chọn
        });
      }
    }

    // Select Menu Interaction
    if (interaction.isStringSelectMenu()) {
      console.log(`${interaction.user.tag} chọn: ${interaction.values}`);
      await interaction.reply({
        content: `Bạn đã chọn: ${interaction.values.join(", ")}`,
        ephemeral: true,
      });
    }
  },
};

// Hàm helper để hiện icon đẹp
function icon(choice) {
  switch (choice) {
    case "rock":
      return "✊ Búa";
    case "paper":
      return "✋ Bao";
    case "scissors":
      return "✌️ Kéo";
  }
}
