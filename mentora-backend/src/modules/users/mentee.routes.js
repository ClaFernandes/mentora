const express = require("express");
const router = express.Router();
const { getMentee } = require("./mentee.controller");

router.get("/:id", getMentee);

module.exports = router;