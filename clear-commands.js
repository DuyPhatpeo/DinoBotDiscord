// clear-commands.js
require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("🗑️ Clearing all commands...");

    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: [],
      });
      console.log("✅ All guild commands cleared.");
    }

    await rest.put(Routes.applicationCommands(clientId), { body: [] });
    console.log(
      "✅ All global commands cleared (Discord có thể mất 1–3h để xoá cache)."
    );
  } catch (err) {
    console.error("❌ Lỗi clear:", err);
  }
})();
