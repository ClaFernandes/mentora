const { followMentor, unfollowMentor } = require("./follow.service");

const followMentorController = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await followMentor(userId, userRole, req.params.id);
  res.status(201).json(result);
};

const unfollowMentorController = async (req, res) => {
  const userId = req.user.id;
  const result = await unfollowMentor(userId, req.params.id);
  res.status(200).json(result);
};

module.exports = { followMentorController, unfollowMentorController };
