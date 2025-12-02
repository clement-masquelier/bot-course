const Discord = require("discord.js");
const { getUserByDiscordId } = require("../controllers/user.controller.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("whois")
        .setDescription(
            "Révèle le compte instagram de l'utilisateur mentionné."
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("L'utilisateur Discord à rechercher")
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser("user");
        try {
            const userData = await getUserByDiscordId(user.id);
            if (!userData) {
                await interaction.reply({
                    content: `L'utilisateur ${user.tag} n'a pas connecté son compte Instagram.`,
                    ephemeral: true,
                });
                return;
            }
            await interaction.reply({
                content: `Le compte Instagram de ${user.tag} est ${userData.instagram_account}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content:
                    "Une erreur est survenue lors de la récupération des informations.",
                ephemeral: true,
            });
        }
    },
};
