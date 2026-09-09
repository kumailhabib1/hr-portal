const express = require("express");

const {
    register,
    login,
    getMe,
    logout,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Current logged-in user
router.get("/me", authMiddleware, getMe);

// Logout
router.post("/logout", authMiddleware, logout);

module.exports = router;