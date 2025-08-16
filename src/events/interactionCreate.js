const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    // Slash Command
    if (interaction.isChatInputCommand()) {
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
    }

    // Button Interaction
    if (interaction.isButton()) {
      // 🎮 Oẳn tù tì
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
          components: [], // xoá nút sau khi chọn
        });
      }

      // 📊 Poll vote
      if (interaction.customId.startsWith("poll_")) {
        const [, pollId, choiceIndex] = interaction.customId.split("_");
        const poll = interaction.client.polls?.get(pollId);

        if (!poll) {
          return interaction.reply({
            content: "❌ Poll đã hết hạn hoặc không tồn tại.",
            ephemeral: true,
          });
        }

        // Ghi nhận vote
        poll.votes[interaction.user.id] = parseInt(choiceIndex);

        // Tính lại kết quả
        const total = Object.keys(poll.votes).length;
        const counts = poll.choices.map(
          (_, i) => Object.values(poll.votes).filter((v) => v === i).length
        );

        const embed = new EmbedBuilder()
          .setColor(0x00ff00)
          .setTitle("📊 " + poll.question)
          .setDescription(
            poll.choices
              .map((c, i) => {
                const count = counts[i];
                const percent =
                  total === 0 ? 0 : Math.round((count / total) * 100);
                const bar = "🟦".repeat(Math.round(percent / 10)) || "⬜";
                return `**${i + 1}. ${c}**\n${bar} ${count} vote (${percent}%)`;
              })
              .join("\n\n")
          );

        // Cập nhật poll
        await poll.message.edit({
          embeds: [embed],
          components: poll.message.components,
        });

        return interaction.reply({
          content: `🗳️ Bạn đã vote cho **${poll.choices[choiceIndex]}**`,
          ephemeral: true,
        });
      }
    }

    // Select Menu Interaction (dropdown)
    if (interaction.isStringSelectMenu()) {
      console.log(`${interaction.user.tag} chọn: ${interaction.values}`);
      await interaction.reply({
        content: `✅ Bạn đã chọn: ${interaction.values.join(", ")}`,
        ephemeral: true,
      });
    }
  },
};

// Helper: hiện icon đẹp cho Oẳn tù tì
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
