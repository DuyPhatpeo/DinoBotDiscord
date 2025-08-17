// src/index.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const express = require("express");

// Khởi tạo Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

/** Hàm đệ quy quét file .js trong thư mục */
const walk = (dir) =>
  fs.readdirSync(dir).flatMap((file) => {
    const fullPath = path.join(dir, file);
    return fs.statSync(fullPath).isDirectory() ? walk(fullPath) : [fullPath];
  });

/** Load tất cả command */
const commandsPath = path.join(__dirname, "commands");
if (fs.existsSync(commandsPath)) {
  const commandFiles = walk(commandsPath).filter((f) => f.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(file);
    if (command?.data?.name && command?.execute) {
      client.commands.set(command.data.name, command);
    }
  }

  const allCommands = [...client.commands.keys()];
  console.log("─────────────── 📜 Commands Loaded ───────────────");
  allCommands.forEach((cmd, i) => console.log(` ${i + 1}. ${cmd}`));
  console.log("───────────────────────────────────────────────");
  console.log(`✅ Total: ${allCommands.length} commands`);
}

/** Load events */
const eventsPath = path.join(__dirname, "events");
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((f) => f.endsWith(".js"));
  for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    event.once
      ? client.once(event.name, (...args) => event.execute(...args))
      : client.on(event.name, (...args) => event.execute(...args));
  }
}

/** Login bot Discord */
client.login(process.env.DISCORD_TOKEN);

/** Express keep-alive server cho Render */
const app = express();
app.get("/", (req, res) => res.send("✅ DinoBot is running on Render!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🌐 Keep-alive web server listening on port ${PORT}`)
);
