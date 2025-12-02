const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    instagram_account: {
        type: String,
        required: true,
        unique: true,
    },
    discord_id: {
        type: String,
        required: true,
        unique: true,
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
