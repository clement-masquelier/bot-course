const Discord = require("discord.js");
const curl = require("curl");
const { getAllUsers, addScore } = require("../controllers/user.controller");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("updatescores")
        .setDescription(
            "Met à jour les scores de tous les utilisateurs enregistrés pour le jour demandé"
        )
        .addIntegerOption((option) =>
            option
                .setName("day")
                .setDescription("Le jour pour lequel mettre à jour les scores")
                .setRequired(true)
        ),
    async execute(interaction) {
        if (
            !interaction.member.permissions.has(
                Discord.PermissionFlagsBits.Administrator
            )
        ) {
            return await interaction.reply({
                content:
                    "Vous n'avez pas la permission d'utiliser cette commande.",
                ephemeral: true,
            });
        }

        const registeredUsers = await getAllUsers();
        for (const user of registeredUsers) {
            var results;
            curl.get(
                `https://api.thefollowergames.com/results/search?day=${interaction.options.getInteger(
                    "day"
                )}&group=Follower Race&q=${user.instagram_account}`,
                function (err, response, body) {
                    if (err) {
                        console.error("Error fetching the webpage:", err);
                        return;
                    }
                    results = JSON.parse(body).results;

                    let exactMatch = null;
                    for (let i = 0; i < results.length; i++) {
                        if (
                            results[i].username.toLowerCase() ===
                            user.instagram_account.toLowerCase()
                        ) {
                            exactMatch = results[i];
                            break;
                        }
                    }
                    if (!exactMatch) {
                        console.log(
                            `Score for ${
                                user.instagram_account
                            } not found for day ${interaction.options.getInteger(
                                "day"
                            )}.`
                        );
                        return;
                    }
                    addScore(
                        user._id,
                        exactMatch.rank,
                        exactMatch.points,
                        interaction.options.getInteger("day")
                    );
                }
            );
        }
        await interaction.reply({
            content: `Mise à jour des scores pour le jour ${interaction.options.getInteger(
                "day"
            )} terminée.`,
            ephemeral: true,
        });
    },
};
