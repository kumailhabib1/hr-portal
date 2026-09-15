const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| GET ALL EMPLOYEES
|--------------------------------------------------------------------------
*/

const getEmployees = async (req, res) => {
    try {
        const [employees] = await pool.execute(`
            SELECT
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
                e.profile_photo,
                e.department_id,
                e.position,
                e.manager_id,
                e.joining_date,
                e.employment_type,
                e.salary,
                e.skills,
                e.emergency_contact_name,
                e.emergency_contact_phone,
                e.status,
                e.created_at,
                e.updated_at,

                d.name AS department_name,

                CONCAT(
                    e.first_name,
                    ' ',
                    e.last_name
                ) AS full_name

            FROM employees e

            LEFT JOIN departments d
                ON e.department_id = d.id

            ORDER BY
                e.created_at DESC,
                e.first_name ASC
        `);

        const formattedEmployees = employees.map((employee) => {
            const firstName =
                employee.first_name || "";

            const lastName =
                employee.last_name || "";

            const name =
                `${firstName} ${lastName}`.trim();

            const initials =
                `${firstName.charAt(0)}${lastName.charAt(0)}`
                    .toUpperCase();

            return {
                ...employee,

                // Fields used by All Employees UI
                name: name || "Unnamed Employee",

                department:
                    employee.department_name ||
                    "Unassigned",

                initials:
                    initials || "NA",
            };
        });

        return res.status(200).json({
            success: true,
            count: formattedEmployees.length,
            employees: formattedEmployees,
        });

    } catch (error) {
        console.error(
            "Get employees error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to load employees",
            error: error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| GET SINGLE EMPLOYEE
|--------------------------------------------------------------------------
*/

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const [employees] = await pool.execute(
            `
            SELECT
                e.*,
                d.name AS department_name,

                CONCAT(
                    e.first_name,
                    ' ',
                    e.last_name
                ) AS full_name

            FROM employees e

            LEFT JOIN departments d
                ON e.department_id = d.id

            WHERE e.id = ?

            LIMIT 1
            `,
            [id]
        );

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        const employee = employees[0];

        const initials =
            `${employee.first_name?.charAt(0) || ""}${employee.last_name?.charAt(0) || ""}`
                .toUpperCase();

        return res.status(200).json({
            success: true,
            employee: {
                ...employee,
                name:
                    employee.full_name ||
                    "Unnamed Employee",
                department:
                    employee.department_name ||
                    "Unassigned",
                initials:
                    initials || "NA",
            },
        });

    } catch (error) {
        console.error(
            "Get employee error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to load employee",
            error: error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| CREATE EMPLOYEE
|--------------------------------------------------------------------------
*/

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
            status = "Active",
        } = req.body;

        if (
            !employee_code ||
            !first_name ||
            !last_name ||
            !email ||
            !department_id ||
            !position ||
            !joining_date
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Employee code, name, email, department, position and joining date are required",
            });
        }

        // Check employee code
        const [existingCode] = await pool.execute(
            `
            SELECT id
            FROM employees
            WHERE employee_code = ?
            LIMIT 1
            `,
            [employee_code]
        );

        if (existingCode.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Employee code already exists",
            });
        }

        // Check email
        const [existingEmail] = await pool.execute(
            `
            SELECT id
            FROM employees
            WHERE email = ?
            LIMIT 1
            `,
            [email]
        );

        if (existingEmail.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Employee email already exists",
            });
        }

        // Check department
        const [department] = await pool.execute(
            `
            SELECT id
            FROM departments
            WHERE id = ?
            LIMIT 1
            `,
            [department_id]
        );

        if (department.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        // Check manager if provided
        if (manager_id) {
            const [manager] = await pool.execute(
                `
                SELECT id
                FROM employees
                WHERE id = ?
                LIMIT 1
                `,
                [manager_id]
            );

            if (manager.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Manager not found",
                });
            }
        }

        const [result] = await pool.execute(
            `
            INSERT INTO employees
            (
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
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                employee_code,
                first_name,
                last_name,
                email,
                phone || null,
                date_of_birth || null,
                gender || null,
                address || null,
                city || null,
                country || null,
                department_id,
                position,
                manager_id || null,
                joining_date,
                employment_type || "Full-time",
                salary || 0,
                skills || null,
                emergency_contact_name || null,
                emergency_contact_phone || null,
                status,
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            employeeId: result.insertId,
        });

    } catch (error) {
        console.error(
            "Create employee error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to create employee",
            error: error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| UPDATE EMPLOYEE
|--------------------------------------------------------------------------
*/

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

        const [existing] = await pool.execute(
            `
            SELECT id
            FROM employees
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        await pool.execute(
            `
            UPDATE employees
            SET
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
            WHERE id = ?
            `,
            [
                employee_code,
                first_name,
                last_name,
                email,
                phone || null,
                date_of_birth || null,
                gender || null,
                address || null,
                city || null,
                country || null,
                department_id,
                position,
                manager_id || null,
                joining_date,
                employment_type || "Full-time",
                salary || 0,
                skills || null,
                emergency_contact_name || null,
                emergency_contact_phone || null,
                status || "Active",
                id,
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
        });

    } catch (error) {
        console.error(
            "Update employee error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to update employee",
            error: error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| DELETE EMPLOYEE
|--------------------------------------------------------------------------
*/

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.execute(
            `
            SELECT id
            FROM employees
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        await pool.execute(
            `
            DELETE FROM employees
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
        });

    } catch (error) {
        console.error(
            "Delete employee error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to delete employee",
            error: error.message,
        });
    }
};


module.exports = {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};