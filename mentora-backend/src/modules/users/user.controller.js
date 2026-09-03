const { deleteUser } = require("./user.service");

const deleteMe = async (req, res) => {
    const result = await deleteUser(req.user.id);
    res.status(200).json(result);
}

module.exports = { deleteMe };