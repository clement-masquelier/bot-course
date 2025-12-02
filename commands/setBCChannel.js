const Discord = require("discord.js");
const {
    setBroadcastChannel,
} = require("../controllers/broadcastChannel.controller");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("setbroadcastchannel")
        .setDescription("Définit dans quel channel envoyer les annonces")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("Le channel de diffusion des annonces")
                .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");
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

        try {
            await setBroadcastChannel(channel.id);
            await interaction.reply({
                content: `Le channel de diffusion des annonces a été défini sur ${channel}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content:
                    "Une erreur est survenue lors de la définition du channel de diffusion des annonces.",
                ephemeral: true,
            });
        }
    },
};
