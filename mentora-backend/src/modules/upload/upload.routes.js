const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadImageController } = require("./upload.controller");
const { verifyToken } = require("../auth/auth.middleware");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", verifyToken, upload.single("image"), uploadImageController);

module.exports = router;