const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
    user_db_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    place: {
        type: Number,
        required: true,
    },
    points: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    race_day: {
        type: Number,
        required: true,
    },
});

const Score = mongoose.model("Score", scoreSchema);
module.exports = Score;
