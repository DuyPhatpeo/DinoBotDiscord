// deploy-commands.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

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
    console.log(`🔁 Deploying ${commands.length} global commands...`);
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log(
      "✅ Global commands deployed. Có thể mất 1–3 giờ để Discord cập nhật."
    );
  } catch (err) {
    console.error(err);
  }
})();
