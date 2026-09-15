const bcrypt = require("bcryptjs");
const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| GET EMPLOYEE PROFILE
|--------------------------------------------------------------------------
|
| GET /api/employee/profile
|
| Requires:
| Authorization: Bearer <employee-jwt>
|
|--------------------------------------------------------------------------
*/

const getEmployeeProfile = async (req, res) => {
    try {
        /*
        |--------------------------------------------------------------------------
        | Employee ID comes from JWT
        |--------------------------------------------------------------------------
        |
        | employee-login creates the token with:
        |
        | employee_id: user.employee_database_id
        |
        */

        const employeeId = req.user.employee_id;

        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: "Employee ID is missing from token",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Get Employee
        |--------------------------------------------------------------------------
        */

        const [employees] = await pool.execute(
            `
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
                ) AS full_name,

                CONCAT(
                    manager.first_name,
                    ' ',
                    manager.last_name
                ) AS manager_name

            FROM employees e

            LEFT JOIN departments d
                ON e.department_id = d.id

            LEFT JOIN employees manager
                ON e.manager_id = manager.id

            WHERE e.id = ?

            LIMIT 1
            `,
            [employeeId]
        );

        /*
        |--------------------------------------------------------------------------
        | Employee Not Found
        |--------------------------------------------------------------------------
        */

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee profile not found",
            });
        }

        const employee = employees[0];

        /*
        |--------------------------------------------------------------------------
        | Check Employee Status
        |--------------------------------------------------------------------------
        */

        if (employee.status !== "Active") {
            return res.status(403).json({
                success: false,
                message:
                    `Your employee account is ${employee.status.toLowerCase()}`,
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Initials
        |--------------------------------------------------------------------------
        */

        const initials =
            `${employee.first_name?.charAt(0) || ""}${employee.last_name?.charAt(0) || ""}`
                .toUpperCase();

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return res.status(200).json({
            success: true,

            employee: {
                id: employee.id,

                employee_code:
                    employee.employee_code,

                first_name:
                    employee.first_name,

                last_name:
                    employee.last_name,

                full_name:
                    employee.full_name,

                email:
                    employee.email,

                phone:
                    employee.phone,

                date_of_birth:
                    employee.date_of_birth,

                gender:
                    employee.gender,

                address:
                    employee.address,

                city:
                    employee.city,

                country:
                    employee.country,

                profile_photo:
                    employee.profile_photo,

                department_id:
                    employee.department_id,

                department_name:
                    employee.department_name,

                position:
                    employee.position,

                manager_id:
                    employee.manager_id,

                manager_name:
                    employee.manager_name,

                joining_date:
                    employee.joining_date,

                employment_type:
                    employee.employment_type,

                salary:
                    employee.salary,

                skills:
                    employee.skills,

                emergency_contact_name:
                    employee.emergency_contact_name,

                emergency_contact_phone:
                    employee.emergency_contact_phone,

                status:
                    employee.status,

                initials:
                    initials || "NA",

                created_at:
                    employee.created_at,

                updated_at:
                    employee.updated_at,
            },
        });

    } catch (error) {
        console.error(
            "Get employee profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load employee profile",
            error:
                error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| UPDATE EMPLOYEE PROFILE
|--------------------------------------------------------------------------
|
| PUT /api/employee/profile
|
| Employee can update selected personal information.
|
|--------------------------------------------------------------------------
*/

const updateEmployeeProfile = async (req, res) => {
    try {
        const employeeId =
            req.user.employee_id;

        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message:
                    "Employee ID is missing from token",
            });
        }

        const {
            phone,
            address,
            city,
            country,
            emergency_contact_name,
            emergency_contact_phone,
        } = req.body;

        /*
        |--------------------------------------------------------------------------
        | Check Employee
        |--------------------------------------------------------------------------
        */

        const [employees] =
            await pool.execute(
                `
                SELECT
                    id,
                    status
                FROM employees
                WHERE id = ?
                LIMIT 1
                `,
                [employeeId]
            );

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Employee not found",
            });
        }

        if (employees[0].status !== "Active") {
            return res.status(403).json({
                success: false,
                message:
                    "Your employee account is not active",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Update Allowed Fields
        |--------------------------------------------------------------------------
        */

        await pool.execute(
            `
            UPDATE employees
            SET
                phone = ?,
                address = ?,
                city = ?,
                country = ?,
                emergency_contact_name = ?,
                emergency_contact_phone = ?
            WHERE id = ?
            `,
            [
                phone || null,
                address || null,
                city || null,
                country || null,
                emergency_contact_name || null,
                emergency_contact_phone || null,
                employeeId,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return res.status(200).json({
            success: true,
            message:
                "Employee profile updated successfully",
        });

    } catch (error) {
        console.error(
            "Update employee profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to update employee profile",
            error:
                error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| CHANGE EMPLOYEE PASSWORD
|--------------------------------------------------------------------------
|
| PUT /api/employee/password
|
|--------------------------------------------------------------------------
*/

const changeEmployeePassword = async (req, res) => {
    try {
        const userId =
            req.user.id;

        const {
            current_password,
            new_password,
            confirm_password,
        } = req.body;

        /*
        |--------------------------------------------------------------------------
        | Validation
        |--------------------------------------------------------------------------
        */

        if (
            !current_password ||
            !new_password ||
            !confirm_password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password, new password and confirm password are required",
            });
        }

        if (new_password.length < 8) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 8 characters long",
            });
        }

        if (
            new_password !== confirm_password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "New password and confirm password do not match",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Get User
        |--------------------------------------------------------------------------
        */

        const [users] =
            await pool.execute(
                `
                SELECT
                    id,
                    password,
                    role,
                    status
                FROM users
                WHERE id = ?
                LIMIT 1
                `,
                [userId]
            );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "User account not found",
            });
        }

        const user = users[0];

        /*
        |--------------------------------------------------------------------------
        | Verify User Role
        |--------------------------------------------------------------------------
        */

        if (user.role !== "Employee") {
            return res.status(403).json({
                success: false,
                message:
                    "This endpoint is only available for employees",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Check Account Status
        |--------------------------------------------------------------------------
        */

        if (user.status !== "Active") {
            return res.status(403).json({
                success: false,
                message:
                    "Your account is not active",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Verify Current Password
        |--------------------------------------------------------------------------
        */

        const passwordMatch =
            await bcrypt.compare(
                current_password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Current password is incorrect",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Prevent Same Password
        |--------------------------------------------------------------------------
        */

        const samePassword =
            await bcrypt.compare(
                new_password,
                user.password
            );

        if (samePassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be different from current password",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Hash New Password
        |--------------------------------------------------------------------------
        */

        const hashedPassword =
            await bcrypt.hash(
                new_password,
                10
            );

        /*
        |--------------------------------------------------------------------------
        | Update Password
        |--------------------------------------------------------------------------
        */

        await pool.execute(
            `
            UPDATE users
            SET password = ?
            WHERE id = ?
            `,
            [
                hashedPassword,
                userId,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return res.status(200).json({
            success: true,
            message:
                "Password changed successfully",
        });

    } catch (error) {
        console.error(
            "Change employee password error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to change password",
            error:
                error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = {
    getEmployeeProfile,
    updateEmployeeProfile,
    changeEmployeePassword,
};