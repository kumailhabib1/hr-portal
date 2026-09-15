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

/*
|--------------------------------------------------------------------------
| Employee Routes
|--------------------------------------------------------------------------
*/

// Get all employees
router.get(
    "/",
    authMiddleware,
    getEmployees
);

// Create employee + login account
router.post(
    "/",
    authMiddleware,
    createEmployee
);

// Get single employee
router.get(
    "/:id",
    authMiddleware,
    getEmployeeById
);

// Update employee
router.put(
    "/:id",
    authMiddleware,
    updateEmployee
);

// Delete employee
router.delete(
    "/:id",
    authMiddleware,
    deleteEmployee
);

module.exports = router;