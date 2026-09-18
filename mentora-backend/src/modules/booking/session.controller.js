const {
  createSession,
  getSessions,
  cancelSession,
  rateSession,
} = require("./session.service");

const createSessionController = async (req, res) => {
  const userId = req.user.id;
  const sessionData = req.body;
  const result = await createSession(userId, sessionData);
  res.status(201).json(result);
};

const getSessionsController = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await getSessions(userId, userRole);
  res.status(200).json(result);
};

const cancelSessionController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const result = await cancelSession(id, userId);
  res.status(200).json(result);
};

const rateSessionController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { rating, reviewText } = req.body;
  const result = await rateSession(id, userId, { rating, reviewText });
  res.status(200).json(result);
};

module.exports = {
  createSessionController,
  getSessionsController,
  cancelSessionController,
  rateSessionController,
};
