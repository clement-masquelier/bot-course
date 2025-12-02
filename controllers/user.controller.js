const UserModel = require("../models/user.model");
const ScoreModel = require("../models/score.model");

exports.createUser = async (instagram_account, discord_id) => {
    //search if it exists
    const existingUser = await UserModel.findOne({ instagram_account });
    if (existingUser) {
        return null;
    }
    const user = new UserModel({ instagram_account, discord_id });
    return await user.save();
};
exports.getUserByDiscordId = async (discord_id) => {
    return await UserModel.findOne({ discord_id });
};

exports.getAllUsers = async () => {
    return await UserModel.find();
};

exports.addScore = async (user_db_id, place, points, race_day) => {
    //check if score
    const existingScore = await ScoreModel.findOne({ user_db_id, race_day });
    if (existingScore) {
        return null;
    }
    const score = new ScoreModel({ user_db_id, place, points, race_day });
    return await score.save();
};

exports.getTotalScoreFromForUserByDiscordId = async (discord_id, nb_days) => {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - nb_days);
    const user = await UserModel.findOne({ discord_id });
    if (!user) {
        return 0;
    }
    const scores = await ScoreModel.find({
        user_db_id: user._id,
        date: { $gte: sinceDate },
    });
    return scores.reduce((total, score) => total + score.points, 0);
};

exports.getScoresFromLastRace = async (race_day) => {
    return await ScoreModel.find({ race_day }).populate("user_db_id");
};
