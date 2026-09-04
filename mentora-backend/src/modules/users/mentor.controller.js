const { getMentorProfile, updateMentorProfile } = require("./mentor.service");

const getMentor = async (req, res) => {
    const { id } = req.params;
    const result = await getMentorProfile(id);
    res.status(200).json(result);
};

const updateMentor = async (req, res) => {
    const userId = req.user.id;
    const updates = req.body;
    const result = await updateMentorProfile(userId, updates);
    res.status(200).json(result);
};

module.exports = { getMentor, updateMentor };
