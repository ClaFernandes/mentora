const { addFavorite, removeFavorite, getFavorites } = require("./favorite.service");

const addFavoriteController = async (req, res) => {
    const menteeId = req.user.id;
    const { id: offeringId } = req.params;
    const result = await addFavorite(menteeId, offeringId);
    res.status(201).json(result);
};

const removeFavoriteController = async (req, res) => {
    const menteeId = req.user.id;
    const { id: offeringId } = req.params;
    const result = await removeFavorite(menteeId, offeringId);
    res.status(200).json(result);
};

const getFavoritesController = async (req, res) => {
    const menteeId = req.user.id;
    const result = await getFavorites(menteeId);
    res.status(200).json(result);
};

module.exports = { addFavoriteController, removeFavoriteController, getFavoritesController };