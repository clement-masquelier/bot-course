const Discord = require("discord.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("currentraceday")
        .setDescription("Affiche le jour de course actuel"),
    async execute(interaction) {
        await interaction.reply({
            content: `Le jour de course actuel est le ${interaction.client.actualDay}.`,
            ephemeral: true,
        });
    },
};
