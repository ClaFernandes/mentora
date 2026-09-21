const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadImageController } = require("./upload.controller");
const { verifyToken } = require("../auth/auth.middleware");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
            const error = new Error("Só são aceites imagens JPG, PNG, WEBP ou GIF");
            error.statusCode = 400;
            return cb(error);
        }
        cb(null, true);
    },
});

const uploadSingleImage = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                err.statusCode = 400;
                err.message = "A imagem é demasiado grande (máximo 5 MB)";
            }
            return next(err);
        }
        next();
    });
};

router.post("/upload", verifyToken, uploadSingleImage, uploadImageController);

module.exports = router;