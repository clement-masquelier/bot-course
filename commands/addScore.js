const Discord = require("discord.js");
const {
    addScore,
    getUserByDiscordId,
} = require("../controllers/user.controller.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("addscore")
        .setDescription("Add a score to a user.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The Discord user to add score to")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("place")
                .setDescription("The place achieved by the user")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("points")
                .setDescription("The points awarded to the user")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("day")
                .setDescription("The day for which the score is being added")
                .setRequired(true)
        ),
    async execute(interaction) {
        // Vérifier les permissions de l'utilisateur
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

        const discordUser = interaction.options.getUser("user");
        const place = interaction.options.getInteger("place");
        const points = interaction.options.getInteger("points");
        const day = interaction.options.getInteger("day");

        try {
            const userData = await getUserByDiscordId(discordUser.id);
            if (!userData) {
                await interaction.reply({
                    content: `L'utilisateur ${discordUser.tag} n'a pas connecté son compte Instagram.`,
                    ephemeral: true,
                });
                return;
            }
            await addScore(userData._id, place, points, day);
            await interaction.reply({
                content: `Score ajouté pour ${discordUser.tag} : place ${place}, points ${points}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "Une erreur est survenue lors de l'ajout du score.",
                ephemeral: true,
            });
        }
    },
};
