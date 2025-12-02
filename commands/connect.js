const Discord = require("discord.js");
const { createUser } = require("../controllers/user.controller");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("connect")
        .setDescription(
            "Entre ton nom d'utilisateur Instagram pour te connecter au bot."
        )
        .addStringOption((option) =>
            option
                .setName("username")
                .setDescription("Ton nom d'utilisateur Instagram")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription(
                    "The Discord user to connect the Instagram account to"
                )
                .setRequired(false)
        ),

    async execute(interaction) {
        const username = interaction.options.getString("username");
        // Vérifier les permissions de l'utilisateur
        if (interaction.options.getUser("user")) {
            if (!(interaction.options.getUser("user") === interaction.user)) {
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
            }
        }

        const discordUser =
            interaction.options.getUser("user") || interaction.user;
        try {
            const result = await createUser(username, discordUser.id);
            if (result === null) {
                await interaction.reply({
                    content:
                        "Le compte n'a pas pu être connecté (peut être existe-t-il déjà ?!?!?!?!)",
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: "Connexion réussie !",
                    ephemeral: true,
                });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content:
                    "Le compte n'a pas pu être connecté (peut être existe-t-il déjà ?!?!?!?!)",
                ephemeral: true,
            });
        }
    },
};
