const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports.handleButton = async (interaction) => {
  // 🎮 Oẳn tù tì
  if (["rock", "paper", "scissors"].includes(interaction.customId)) {
    const userChoice = interaction.customId;
    const choices = ["rock", "paper", "scissors"];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    let result = "";
    if (userChoice === botChoice) result = "⚖️ Hòa nhau!";
    else if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    )
      result = "🎉 Bạn thắng!";
    else result = "😢 Bot thắng!";

    return interaction.update({
      content: `🫵 Bạn chọn: **${icon(userChoice)}**\n🤖 Bot chọn: **${icon(
        botChoice
      )}**\n\n👉 ${result}`,
      components: [], // Xóa nút sau khi chọn
    });
  }

  // 📊 Poll
  if (interaction.customId.startsWith("poll_")) {
    const [, pollId, choiceIndex] = interaction.customId.split("_");
    const poll = interaction.client.polls?.get(pollId);

    // Nếu poll không tồn tại hoặc hết hạn → disable luôn nút
    if (!poll) {
      return interaction.update({
        content: "❌ Poll đã hết hạn hoặc không tồn tại.",
        components: disableAllButtons(interaction.message.components),
      });
    }

    // Ghi nhận vote
    poll.votes[interaction.user.id] = parseInt(choiceIndex);

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
            const percent = total === 0 ? 0 : Math.round((count / total) * 100);
            const bar = "🟦".repeat(Math.round(percent / 10)) || "⬜";
            return `**${i + 1}. ${c}**\n${bar} ${count} vote (${percent}%)`;
          })
          .join("\n\n")
      );

    try {
      await poll.message.edit({
        embeds: [embed],
        components: poll.message.components,
      });
    } catch (err) {
      console.error("❌ Lỗi khi update poll:", err);
    }

    return interaction.reply({
      content: `🗳️ Bạn đã vote cho **${poll.choices[choiceIndex]}**`,
      ephemeral: true,
    });
  }
};

// helper icon
function icon(choice) {
  switch (choice) {
    case "rock":
      return "✊ Búa";
    case "paper":
      return "✋ Bao";
    case "scissors":
      return "✌️ Kéo";
    default:
      return "❓"; // fallback nếu lỡ sai customId
  }
}

// helper disable all buttons (khi poll hết hạn)
function disableAllButtons(rows) {
  return rows.map((row) => {
    const actionRow = new ActionRowBuilder();
    row.components.forEach((btn) => {
      actionRow.addComponents(ButtonBuilder.from(btn).setDisabled(true));
    });
    return actionRow;
  });
}
