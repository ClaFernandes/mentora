const {
  createOffering,
  updateOffering,
  deleteOffering,
  getAllOfferings,
  getOfferingById,
} = require("./offering.service");

const createOfferingController = async (req, res) => {
  const userId = req.user.id;
  const offeringData = req.body;
  const result = await createOffering(userId, offeringData);
  res.status(201).json(result);
};

const updateOfferingController = async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;
  const result = await updateOffering(req.params.id, userId, updates);
  res.status(200).json(result);
};

const deleteOfferingController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const result = await deleteOffering(id, userId);
  res.status(200).json(result);
};

const getAllOfferingsController = async (req, res) => {
  const result = await getAllOfferings();
  res.status(200).json(result);
};

const getOfferingByIdController = async (req, res) => {
  const { id } = req.params;
  const result = await getOfferingById(id);
  res.status(200).json(result);
};

module.exports = {
  createOfferingController,
  updateOfferingController,
  deleteOfferingController,
  getAllOfferingsController,
  getOfferingByIdController,
};
