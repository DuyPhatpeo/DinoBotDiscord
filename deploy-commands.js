require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // thêm vào .env

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

    // Deploy Guild Commands (cập nhật gần như ngay lập tức)
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
      console.log("✅ Guild commands deployed (cập nhật ngay).");
    }

    // Deploy Global Commands (cần 1–3h để update)
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log("✅ Global commands deployed.");
  } catch (err) {
    console.error(err);
  }
})();
