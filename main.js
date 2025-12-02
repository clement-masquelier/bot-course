const Discord = require("discord.js");
const intents = [33281];
const bot = new Discord.Client({ intents: intents });
const loadCommands = require("./loader/loadCommands");
const mongoose = require("mongoose");
const { connectDB } = require("./loader/db");
const checkForScores = require("./loader/checkForScores");
connectDB();

var actualDay = 53;

bot.commands = new Discord.Collection();
bot.actualDay = actualDay;
loadCommands(bot);

const rest = new Discord.REST({ version: "10" }).setToken(process.env.TOKEN);
const commandsJSON = bot.commands.map((cmd) => cmd.data.toJSON());

bot.on("clientReady", async () => {
    console.log(`Logged in as ${bot.user.tag}!`);

    try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(
            Discord.Routes.applicationGuildCommands(
                bot.user.id,
                "1445030070883450883"
            ),
            {
                body: commandsJSON,
            }
        );
        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
});

const curl = require("curl");
const { connect } = require("http2");

setTimeout(
    () => {
        checkForScores.check(bot);
    },
    10000,
    bot
);

bot.on("messageCreate", (message) => {
    message.content = message.content.trim();
    if (message.author.bot) return;
    if (message.content.startsWith("!score")) {
        let cleanMessage = message.content.split(" ");
        //delete all empty elements
        cleanMessage = cleanMessage.filter((el) => el !== " " && el !== "");
        console.log(cleanMessage);
        if (cleanMessage.length < 2) {
            message.reply("Veuillez fournir un nom d'utilisateur.");
            return;
        }
        const username = cleanMessage[1];
        curl.get(
            `https://api.thefollowergames.com/results/search?day=${actualDay}&group=Follower Race&q=${username}`,
            function (err, response, body) {
                if (err) {
                    console.error("Error fetching the webpage:", err);
                    return;
                }
                const results = JSON.parse(body).results;
                console.log(body);
                console.log(results);
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
                    message.reply(
                        `Score pour ${username} non trouvé pour la journée ${actualDay}.`
                    );
                    return;
                }
                const answer = `${username} a terminé à la position ${exactMatch.rank} ce qui lui donne ${exactMatch.points} points.`;
                message.reply(answer);
            }
        );
    }
});

// CORRECTION 3 : Il faut écouter l'interaction pour répondre !
bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = bot.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "Erreur lors de l'exécution !",
            ephemeral: true,
        });
    }
});

bot.login(process.env.TOKEN);
