const express = require("express");

const {
    getAttendance,
    getAttendanceById,
    checkIn,
    checkOut,
    updateAttendance,
    deleteAttendance,
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all attendance
router.get(
    "/",
    authMiddleware,
    getAttendance
);

// Get attendance by ID
router.get(
    "/:id",
    authMiddleware,
    getAttendanceById
);

// Check in
router.post(
    "/check-in",
    authMiddleware,
    checkIn
);

// Check out
router.put(
    "/:id/check-out",
    authMiddleware,
    checkOut
);

// Update attendance
router.put(
    "/:id",
    authMiddleware,
    updateAttendance
);

// Delete attendance
router.delete(
    "/:id",
    authMiddleware,
    deleteAttendance
);

module.exports = router;