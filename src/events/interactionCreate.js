module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const { handleCommand } = require("../handlers/commandHandler");
    const { handleButton } = require("../handlers/buttonHandler");
    const { handleSelectMenu } = require("../handlers/selectMenuHandler");

    if (interaction.isChatInputCommand()) return handleCommand(interaction);
    if (interaction.isButton()) return handleButton(interaction);
    if (interaction.isStringSelectMenu()) return handleSelectMenu(interaction);
  },
};
