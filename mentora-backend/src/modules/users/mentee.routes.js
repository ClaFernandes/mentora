const express = require("express");
const router = express.Router();
const { getMentee, updateMentee } = require("./mentee.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.get("/:id", getMentee);
router.put("/me", verifyToken, updateMentee);

module.exports = router;