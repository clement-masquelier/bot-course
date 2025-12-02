const Discord = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
    getScoresFromLastRace: getScoresFromLastRace,
} = require("../controllers/user.controller");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("broadcastranks")
        .setDescription(
            "Affiche le classement des joueurs pour un jour donné dans le channel actuel"
        )
        .addIntegerOption((option) =>
            option
                .setName("day")
                .setDescription("Le jour de course à afficher")
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

        // 1. Get scores of today's race
        const scores = await getScoresFromLastRace(
            interaction.options.getInteger("day")
        );
        console.log(scores);
        // sort scores by place ascending
        scores.sort((a, b) => a.place - b.place);
        console.log("Sorted scores:", scores);

        if (scores.length === 0) {
            await interaction.reply({
                content: `Aucun score trouvé pour le jour ${interaction.options.getInteger(
                    "day"
                )}.`,
                ephemeral: true,
            });
            return;
        }

        // 2. Construction de l'Embed
        const classementEmbed = new EmbedBuilder()
            .setColor(0xffb206)
            .setTitle(
                `🏆 Classement du jour ${interaction.options.getInteger("day")}`
            ) // Le titre principal
            .setURL("https://thefollowergames.com/") // (Optionnel) Rend le titre cliquable
            .setDescription("Voici les résultats actuels de la course !") // Le texte sous le titre
            .setTimestamp() // Affiche l'heure en bas
            .setFooter({
                text: `Identifiant: [RACE_DAY_${interaction.options.getInteger(
                    "day"
                )}]`,
            }); // Le petit texte tout en bas

        for (let i = 0; i < scores.length; i++) {
            if (i == 0) {
                classementEmbed.addFields({
                    name: `#${scores[i].place} - ${scores[i].user_db_id.instagram_account} - 🥇`,
                    value: `${scores[i].points} points <@${scores[i].user_db_id.discord_id}>`,
                    inline: false,
                });
            } else if (i == 1) {
                classementEmbed.addFields({
                    name: `#${scores[i].place} - ${scores[i].user_db_id.instagram_account} - 🥈`,
                    value: `${scores[i].points} points <@${scores[i].user_db_id.discord_id}>`,
                    inline: false,
                });
            } else if (i == 2) {
                classementEmbed.addFields({
                    name: `#${scores[i].place} - ${scores[i].user_db_id.instagram_account} - 🥉`,
                    value: `${scores[i].points} points <@${scores[i].user_db_id.discord_id}>`,
                    inline: false,
                });
            } else {
                classementEmbed.addFields({
                    name: `#${scores[i].place} - ${
                        scores[i].user_db_id.instagram_account
                    } - ${i - 1}eme`,
                    value: `${scores[i].points} points <@${scores[i].user_db_id.discord_id}>`,
                    inline: false,
                });
            }
        }

        // 3. Envoi de l'embed
        // L'option 'ephemeral: true' rend le message visible UNIQUEMENT par l'utilisateur (comme sur ta capture)
        await interaction.reply({
            embeds: [classementEmbed],
            ephemeral: false,
        });
    },
};
