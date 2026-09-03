const MenteeProfile = require("./mentee.model");

const getMenteeProfile = async (userId) => {
    const menteeProfile = await MenteeProfile.findOne({ userId }).populate("userId", "name email avatarUrl");

    if (!menteeProfile) {
        const error = new Error("Perfil de mentorado não encontrado");
        error.statusCode = 404;
        throw error;
    }

    return menteeProfile;
}

module.exports = { getMenteeProfile };