const curl = require("curl");
const { EmbedBuilder } = require("discord.js");
const {
    getBroadcastChannel,
} = require("../controllers/broadcastChannel.controller");
const {
    getAllUsers,
    addScore,
    getScoresFromLastRace,
} = require("../controllers/user.controller");

const updateAndBroadcastScores = async (bot) => {
    const channelId = (await getBroadcastChannel())?.channel_id;
    if (!channelId) {
        console.log("No broadcast channel set. Skipping score broadcast.");
        return;
    }
    const channel = await bot.channels.fetch(channelId);
    if (!channel) {
        console.log("Broadcast channel not found. Skipping score broadcast.");
        return;
    }

    const registeredUsers = await getAllUsers();
    for (const user of registeredUsers) {
        var results;
        curl.get(
            `https://api.thefollowergames.com/results/search?day=${bot.actualDay}&group=Follower Race&q=${user.instagram_account}`,
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
                        `Score for ${user.instagram_account} not found for day ${bot.actualDay}.`
                    );
                    return;
                }
                addScore(
                    user._id,
                    exactMatch.rank,
                    exactMatch.points,
                    bot.actualDay
                );
            }
        );
    }

    //Wait 5 seconds to ensure all scores are added
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const scores = await getScoresFromLastRace(bot.actualDay);
    // sort scores by place ascending
    scores.sort((a, b) => a.place - b.place);

    const classementEmbed = new EmbedBuilder()
        .setColor(0xffb206)
        .setTitle("🏆 La nouvelle course est là !!") // Le titre principal
        .setURL("https://thefollowergames.com/") // (Optionnel) Rend le titre cliquable
        .setDescription("Voici les résultats actuels de la course !") // Le texte sous le titre
        .setTimestamp() // Affiche l'heure en bas
        .setFooter({
            text: `Identifiant: [RACE_DAY_${bot.actualDay}]`,
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
                } - ${i + 1}eme`,
                value: `${scores[i].points} points <@${scores[i].user_db_id.discord_id}>`,
                inline: false,
            });
        }
    }

    // 3. Envoi de l'embed
    // ping everyone
    await channel.send("@everyone");
    await channel.send({ embeds: [classementEmbed], ephemeral: false });
};

const fetchAPI = (bot) => {
    console.log("Fetching API...");
    curl.get(
        "https://api.thefollowergames.com/raceinfo",
        function (err, response, body) {
            if (err) {
                console.error("Error fetching the webpage:", err);
                return;
            }
            const raceInfo = JSON.parse(body);
            if (
                raceInfo.races[raceInfo.races.length - 1].day !== bot.actualDay
            ) {
                bot.actualDay = raceInfo.races[raceInfo.races.length - 1].day;
                console.log(
                    `Nouvelle journée détectée ! Jour actuel mis à jour à ${bot.actualDay}`
                );
                updateAndBroadcastScores(bot);
            }
        }
    );
    console.log("API Fetched.");
};

const check = (bot) => {
    fetchAPI(bot);
    setInterval(
        (bot) => {
            fetchAPI(bot);
        },
        600000,
        bot
    );
};

module.exports = { check };
