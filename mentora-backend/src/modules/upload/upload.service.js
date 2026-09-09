const cloudinary = require("../../config/cloudinary");

const uploadImage = async (file) => {
    if (!file) {
        const error = new Error("Nenhum ficheiro foi enviado");
        error.statusCode = 400;
        throw error;
    }

    const base64Data = file.buffer.toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + base64Data;
    const result = await cloudinary.uploader.upload(dataURI);

    return { url: result.secure_url };
}

module.exports = { uploadImage };