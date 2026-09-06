const express = require("express");
const router = express.Router();
const { follow, unfollow } = require("./follow.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.post("/:id/follow", verifyToken, follow);
router.delete("/:id/follow", verifyToken, unfollow);

module.exports = router;
