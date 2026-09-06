const { followMentor, unfollowMentor } = require("./follow.service");

const follow = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await followMentor(userId, userRole, req.params.id);
  res.status(201).json(result);
};

const unfollow = async (req, res) => {
  const userId = req.user.id;
  const result = await unfollowMentor(userId, req.params.id);
  res.status(200).json(result);
};

module.exports = { follow, unfollow };
