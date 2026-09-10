const express = require("express");

const {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} = require("../controllers/employeeController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all employees
router.get("/", authMiddleware, getEmployees);

// Get single employee
router.get("/:id", authMiddleware, getEmployeeById);

// Add employee
router.post("/", authMiddleware, createEmployee);

// Update employee
router.put("/:id", authMiddleware, updateEmployee);

// Deactivate employee
router.delete("/:id", authMiddleware, deleteEmployee);

module.exports = router;