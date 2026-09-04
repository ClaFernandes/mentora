const express = require("express");
const router = express.Router();
const { getMentor, updateMentor } = require("./mentor.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.get("/:id", getMentor);
router.put("/me", verifyToken, updateMentor);

module.exports = router;