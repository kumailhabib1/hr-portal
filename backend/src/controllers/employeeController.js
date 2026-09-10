const pool = require("../config/db");

// ==========================================
// CREATE EMPLOYEE
// ==========================================

const createEmployee = async (req, res) => {
    try {
        const {
            employee_code,
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            gender,
            address,
            city,
            country,
            department_id,
            position,
            manager_id,
            joining_date,
            employment_type,
            salary,
            skills,
            emergency_contact_name,
            emergency_contact_phone,
            status,
        } = req.body;

        console.log("Create employee request:", req.body);

        // ------------------------------------------
        // REQUIRED FIELDS
        // ------------------------------------------

        if (!first_name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "First name is required",
            });
        }

        if (!last_name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Last name is required",
            });
        }

        if (!email?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        if (!department_id) {
            return res.status(400).json({
                success: false,
                message: "Department is required",
            });
        }

        if (!position?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Position is required",
            });
        }

        if (!joining_date) {
            return res.status(400).json({
                success: false,
                message: "Joining date is required",
            });
        }

        // ------------------------------------------
        // CHECK EMAIL
        // ------------------------------------------

        const [existingEmail] = await pool.execute(
            `SELECT id
             FROM employees
             WHERE email = ?
             LIMIT 1`,
            [email.trim()]
        );

        if (existingEmail.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Employee email already exists",
            });
        }

        // ------------------------------------------
        // CHECK EMPLOYEE CODE
        // ------------------------------------------

        if (employee_code) {
            const [existingCode] = await pool.execute(
                `SELECT id
                 FROM employees
                 WHERE employee_code = ?
                 LIMIT 1`,
                [employee_code]
            );

            if (existingCode.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Employee ID already exists",
                });
            }
        }

        // ------------------------------------------
        // CHECK DEPARTMENT
        // ------------------------------------------

        const [department] = await pool.execute(
            `SELECT id, name
             FROM departments
             WHERE id = ?
             LIMIT 1`,
            [Number(department_id)]
        );

        if (department.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Selected department does not exist",
            });
        }

        // ------------------------------------------
        // CHECK MANAGER
        // ------------------------------------------

        let managerId = null;

        if (manager_id) {
            const [manager] = await pool.execute(
                `SELECT id
                 FROM employees
                 WHERE id = ?
                 LIMIT 1`,
                [Number(manager_id)]
            );

            if (manager.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Selected manager does not exist",
                });
            }

            managerId = Number(manager_id);
        }

        // ------------------------------------------
        // CREATE EMPLOYEE
        // ------------------------------------------

        const [result] = await pool.execute(
            `INSERT INTO employees (
                employee_code,
                first_name,
                last_name,
                email,
                phone,
                date_of_birth,
                gender,
                address,
                city,
                country,
                department_id,
                position,
                manager_id,
                joining_date,
                employment_type,
                salary,
                skills,
                emergency_contact_name,
                emergency_contact_phone,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                employee_code || null,
                first_name.trim(),
                last_name.trim(),
                email.trim(),
                phone?.trim() || null,
                date_of_birth || null,
                gender || null,
                address?.trim() || null,
                city?.trim() || null,
                country?.trim() || "Pakistan",
                Number(department_id),
                position.trim(),
                managerId,
                joining_date,
                employment_type || "Full Time",
                salary ? Number(salary) : 0,
                skills || null,
                emergency_contact_name?.trim() || null,
                emergency_contact_phone?.trim() || null,
                status || "Active",
            ]
        );

        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        res.status(201).json({
            success: true,
            message: "Employee added successfully",
            employeeId: result.insertId,
            employee: {
                id: result.insertId,
                employee_code,
                first_name,
                last_name,
                email,
                department_id: Number(department_id),
                department_name: department[0].name,
                position,
                status: status || "Active",
            },
        });

    } catch (error) {
        console.error("================================");
        console.error("CREATE EMPLOYEE ERROR");
        console.error(error);
        console.error("================================");

        res.status(500).json({
            success: false,
            message: "Server error while adding employee",
            error: error.message,
        });
    }
};


// ==========================================
// GET ALL EMPLOYEES
// ==========================================

const getEmployees = async (req, res) => {
    try {
        const [employees] = await pool.execute(
            `SELECT
                e.id,
                e.employee_code,
                e.first_name,
                e.last_name,
                e.email,
                e.phone,
                e.date_of_birth,
                e.gender,
                e.address,
                e.city,
                e.country,
                e.department_id,
                d.name AS department_name,
                e.position,
                e.manager_id,
                e.joining_date,
                e.employment_type,
                e.salary,
                e.skills,
                e.emergency_contact_name,
                e.emergency_contact_phone,
                e.profile_photo,
                e.status,
                e.created_at,
                e.updated_at
            FROM employees e
            LEFT JOIN departments d
                ON e.department_id = d.id
            ORDER BY e.id DESC`
        );

        res.status(200).json({
            success: true,
            count: employees.length,
            employees,
        });

    } catch (error) {
        console.error("Get employees error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching employees",
            error: error.message,
        });
    }
};


// ==========================================
// GET EMPLOYEE BY ID
// ==========================================

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const [employees] = await pool.execute(
            `SELECT
                e.*,
                d.name AS department_name
            FROM employees e
            LEFT JOIN departments d
                ON e.department_id = d.id
            WHERE e.id = ?
            LIMIT 1`,
            [id]
        );

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        res.status(200).json({
            success: true,
            employee: employees[0],
        });

    } catch (error) {
        console.error("Get employee error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching employee",
            error: error.message,
        });
    }
};


// ==========================================
// UPDATE EMPLOYEE
// ==========================================

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            employee_code,
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            gender,
            address,
            city,
            country,
            department_id,
            position,
            manager_id,
            joining_date,
            employment_type,
            salary,
            skills,
            emergency_contact_name,
            emergency_contact_phone,
            status,
        } = req.body;

        const [existingEmployee] = await pool.execute(
            `SELECT id
             FROM employees
             WHERE id = ?
             LIMIT 1`,
            [id]
        );

        if (existingEmployee.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        await pool.execute(
            `UPDATE employees SET
                employee_code = ?,
                first_name = ?,
                last_name = ?,
                email = ?,
                phone = ?,
                date_of_birth = ?,
                gender = ?,
                address = ?,
                city = ?,
                country = ?,
                department_id = ?,
                position = ?,
                manager_id = ?,
                joining_date = ?,
                employment_type = ?,
                salary = ?,
                skills = ?,
                emergency_contact_name = ?,
                emergency_contact_phone = ?,
                status = ?
            WHERE id = ?`,
            [
                employee_code || null,
                first_name,
                last_name,
                email,
                phone || null,
                date_of_birth || null,
                gender || null,
                address || null,
                city || null,
                country || "Pakistan",
                department_id,
                position,
                manager_id || null,
                joining_date,
                employment_type || "Full Time",
                salary || 0,
                skills || null,
                emergency_contact_name || null,
                emergency_contact_phone || null,
                status || "Active",
                id,
            ]
        );

        res.status(200).json({
            success: true,
            message: "Employee updated successfully",
        });

    } catch (error) {
        console.error("Update employee error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while updating employee",
            error: error.message,
        });
    }
};


// ==========================================
// DEACTIVATE EMPLOYEE
// ==========================================

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const [employee] = await pool.execute(
            `SELECT id
             FROM employees
             WHERE id = ?
             LIMIT 1`,
            [id]
        );

        if (employee.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        await pool.execute(
            `UPDATE employees
             SET status = 'Inactive'
             WHERE id = ?`,
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Employee deactivated successfully",
        });

    } catch (error) {
        console.error("Delete employee error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while deactivating employee",
            error: error.message,
        });
    }
};


module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
};