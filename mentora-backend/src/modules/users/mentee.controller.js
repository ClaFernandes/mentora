const { getMenteeProfile, updateMenteeProfile } = require("./mentee.service");

const getMentee = async (req, res) => {
    const { id } = req.params;
    const result = await getMenteeProfile(id);
    res.status(200).json(result);
}

const updateMentee = async (req, res) => {
    const userId = req.user.id;
    const updates = req.body;
    const result = await updateMenteeProfile(userId, updates);
    res.status(200).json(result);
};


module.exports = { getMentee, updateMentee };