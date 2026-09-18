const express = require("express");

const {
    getPayroll,
    getPayrollById,
    createPayroll,
    updatePayroll,
    processPayroll,
    payPayroll,
    deletePayroll,
} = require("../controllers/payrollController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getPayroll
);

router.get(
    "/:id",
    authMiddleware,
    getPayrollById
);

router.post(
    "/",
    authMiddleware,
    createPayroll
);

router.put(
    "/:id",
    authMiddleware,
    updatePayroll
);

router.put(
    "/:id/process",
    authMiddleware,
    processPayroll
);

router.put(
    "/:id/pay",
    authMiddleware,
    payPayroll
);

router.delete(
    "/:id",
    authMiddleware,
    deletePayroll
);

module.exports = router;