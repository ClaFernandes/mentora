const { getMentorProfile } = require("./mentor.service");

const getMentor = async (req, res) => {
    const { id } = req.params;
    const result = await getMentorProfile(id);
    res.status(200).json(result);
}

module.exports = { getMentor };