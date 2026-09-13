const {
  getAvailableSlots,
  getAvailability,
  createAvailability,
  deleteAvailability,
} = require("./availability.service");

const getAvailableSlotsController = async (req, res) => {
  const { id, date } = req.params;
  const result = await getAvailableSlots(id, date);
  res.status(200).json(result);
};

const getAvailabilityController = async (req, res) => {
  const { id } = req.params;
  const result = await getAvailability(id);
  res.status(200).json(result);
};

const createAvailabilityController = async (req, res) => {
  const userId = req.user.id;
  const availabilityData = req.body;
  const result = await createAvailability(userId, availabilityData);
  res.status(201).json(result);
};

const deleteAvailabilityController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const result = await deleteAvailability(id, userId);
  res.status(200).json(result);
};

module.exports = {
  getAvailableSlotsController,
  getAvailabilityController,
  createAvailabilityController,
  deleteAvailabilityController,
};
