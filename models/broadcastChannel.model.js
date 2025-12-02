const mongoose = require("mongoose");

const bcChannelSchema = new mongoose.Schema({
    channel_id: {
        type: String,
        required: true,
        unique: true,
    },
});

const BroadcastChannel = mongoose.model("BroadcastChannel", bcChannelSchema);
module.exports = BroadcastChannel;
