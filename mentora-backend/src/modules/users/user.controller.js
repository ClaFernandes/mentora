const { deleteUser, updateAvatar } = require("./user.service");

const deleteMeController = async (req, res) => {
    const result = await deleteUser(req.user.id);
    res.status(200).json(result);
};

const updateAvatarController = async (req, res) => {
    const { avatarUrl } = req.body;
    const result = await updateAvatar(req.user.id, avatarUrl);
    res.status(200).json(result);
};

module.exports = { deleteMeController, updateAvatarController };