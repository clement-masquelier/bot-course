const BroadcastChannelModel = require("../models/broadcastChannel.model");

const getBroadcastChannel = async () => {
    return await BroadcastChannelModel.findOne();
};

const setBroadcastChannel = async (channel_id) => {
    let bcChannel = await BroadcastChannelModel.findOne();
    if (bcChannel) {
        bcChannel.channel_id = channel_id;
    } else {
        bcChannel = new BroadcastChannelModel({ channel_id });
    }
    return await bcChannel.save();
};
module.exports = { getBroadcastChannel, setBroadcastChannel };
