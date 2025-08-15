// deploy-commands.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // chỉ deploy tạm thời cho server test

// Hàm đệ quy lấy tất cả command
const walk = (dir) =>
  fs.readdirSync(dir).flatMap((file) => {
    const fullPath = path.join(dir, file);
    return fs.statSync(fullPath).isDirectory() ? walk(fullPath) : [fullPath];
  });

const commands = [];
const commandsPath = path.join(__dirname, "src", "commands");
if (fs.existsSync(commandsPath)) {
  const commandFiles = walk(commandsPath).filter((f) => f.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(file);
    if (command?.data?.toJSON) commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log(`🔁 Deploying ${commands.length} commands...`);
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId), // chỉ cho 1 guild test
      { body: commands }
    );
    console.log("✅ Commands deployed.");
  } catch (err) {
    console.error(err);
  }
})();
