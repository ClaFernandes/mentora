const { uploadImage } = require("./upload.service");

const uploadImageController = async (req, res) => {
    const result = await uploadImage(req.file);
    res.status(200).json(result);
};

module.exports = { uploadImageController };