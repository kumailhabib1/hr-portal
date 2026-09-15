const express = require("express");

const {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
} = require("../controllers/employeeController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getEmployees
);

router.post(
    "/",
    authMiddleware,
    createEmployee
);

router.get(
    "/:id",
    authMiddleware,
    getEmployeeById
);

router.put(
    "/:id",
    authMiddleware,
    updateEmployee
);

router.delete(
    "/:id",
    authMiddleware,
    deleteEmployee
);

module.exports = router;