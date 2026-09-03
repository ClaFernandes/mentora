const { getMenteeProfile } = require("./mentee.service");

const getMentee = async (req, res) => {
    const { id } = req.params;
    const result = await getMenteeProfile(id);
    res.status(200).json(result);
}

module.exports = { getMentee };