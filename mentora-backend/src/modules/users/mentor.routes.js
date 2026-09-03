const express = require("express");
const router = express.Router();
const { getMentor } = require("./mentor.controller");

router.get("/:id", getMentor);

module.exports = router;