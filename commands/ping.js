const Discord = require("discord.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Répond avec Pong!"),
    async execute(interaction) {
        await interaction.reply({ content: "Pong!", ephemeral: true });
    },
};
