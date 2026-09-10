const express = require("express");

const {
    getManagers,
} = require("../controllers/managerController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getManagers);

module.exports = router;