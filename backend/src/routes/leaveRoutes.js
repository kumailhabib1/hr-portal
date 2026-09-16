const express = require("express");

const {
    getLeaves,
    getLeaveById,
    createLeave,
    approveLeave,
    rejectLeave,
    deleteLeave,
} = require("../controllers/leaveController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getLeaves
);

router.get(
    "/:id",
    authMiddleware,
    getLeaveById
);

router.post(
    "/",
    authMiddleware,
    createLeave
);

router.put(
    "/:id/approve",
    authMiddleware,
    approveLeave
);

router.put(
    "/:id/reject",
    authMiddleware,
    rejectLeave
);

router.delete(
    "/:id",
    authMiddleware,
    deleteLeave
);

module.exports = router;