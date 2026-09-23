const express = require("express");
const router = express.Router();
const { verifyToken } = require("./auth.middleware");
const {
    registerUserController,
    loginUserController,
    getMeController,
    forgotPasswordController,
    resetPasswordController,
    changePasswordController,
} = require("./auth.controller");

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/me", verifyToken, getMeController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.put("/change-password", verifyToken, changePasswordController);

module.exports = router;