const express = require("express");

const {
    getDepartments,
} = require("../controllers/departmentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getDepartments);

module.exports = router;