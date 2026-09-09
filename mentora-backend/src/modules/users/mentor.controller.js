const { getMentorProfile, updateMentorProfile, searchMentors } = require("./mentor.service");

const getMentorController = async (req, res) => {
    const { id } = req.params;
    const result = await getMentorProfile(id);
    res.status(200).json(result);
};

const updateMentorController = async (req, res) => {
    const userId = req.user.id;
    const updates = req.body;
    const result = await updateMentorProfile(userId, updates);
    res.status(200).json(result);
};

const searchMentorsController = async (req, res) => {
    const { area, minPrice, maxPrice, minRating, q } = req.query;
    const filters = { area, minPrice, maxPrice, minRating, q };
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const result = await searchMentors(filters, page, limit);
    res.status(200).json(result);
}

module.exports = { getMentorController, updateMentorController, searchMentorsController };
