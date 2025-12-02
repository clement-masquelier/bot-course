const Discord = require("discord.js");
const curl = require("curl");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("score")
        .setDescription("Obtenir le score d'un utilisateur aujourd'hui")
        .addStringOption((option) =>
            option
                .setName("username")
                .setDescription("Nom d'utilisateur à rechercher")
                .setRequired(true)
        ),

    async execute(interaction) {
        const username = interaction.options.getString("username");
        curl.get(
            `https://api.thefollowergames.com/results/search?day=${interaction.client.actualDay}&group=Follower Race&q=${username}`,
            function (err, response, body) {
                if (err) {
                    console.error("Error fetching the webpage:", err);
                    return;
                }
                const results = JSON.parse(body).results;
                let exactMatch = null;
                for (let i = 0; i < results.length; i++) {
                    if (
                        results[i].username.toLowerCase() ===
                        username.toLowerCase()
                    ) {
                        exactMatch = results[i];
                        break;
                    }
                }
                if (!exactMatch) {
                    interaction.reply(
                        `Score pour ${username} non trouvé pour la journée ${interaction.client.actualDay}.`
                    );
                    return;
                }
                const answer = `${username} a terminé à la position ${exactMatch.rank} ce qui lui donne ${exactMatch.points} points. <@${interaction.user.id}>`;
                interaction.reply({ content: answer, ephemeral: true });
            }
        );
    },
};
