const fs = require("fs");

module.exports = (bot) => {
    fs.readdirSync("./commands/").forEach((file) => {
        if (file.endsWith(".js")) {
            const command = require(`../commands/${file}`);
            if (!command.data || !command.execute) {
                console.log(
                    `[WARNING] The command at ../commands/${file} is missing a required "data" or "execute" property.`
                );
            }
            console.log(`Loading command ${command.data.name}`);
            bot.commands.set(command.data.name, command);
        }
    });
};
