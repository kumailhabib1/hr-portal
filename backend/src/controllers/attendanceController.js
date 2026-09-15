const pool = require("../config/db");

/**
 * GET /api/attendance
 * Get all attendance records
 *
 * Optional query parameters:
 * ?date=2026-09-15
 * ?search=Ahmed
 * ?department_id=1
 * ?status=Present
 */
const getAttendance = async (req, res) => {
    try {
        const {
            date,
            search,
            department_id,
            status,
        } = req.query;

        let query = `
            SELECT
                a.id,
                a.employee_id,
                a.attendance_date,
                a.check_in,
                a.check_out,
                a.check_in_latitude,
                a.check_in_longitude,
                a.check_out_latitude,
                a.check_out_longitude,
                a.location_address,
                a.status,
                a.working_hours,

                e.employee_code,
                e.first_name,
                e.last_name,
                e.email,
                e.phone,
                e.position,
                e.profile_photo,

                d.id AS department_id,
                d.name AS department_name

            FROM attendance a

            INNER JOIN employees e
                ON a.employee_id = e.id

            LEFT JOIN departments d
                ON e.department_id = d.id

            WHERE 1 = 1
        `;

        const params = [];

        // Filter by date
        if (date) {
            query += `
                AND a.attendance_date = ?
            `;

            params.push(date);
        }

        // Search employee
        if (search) {
            query += `
                AND (
                    e.first_name LIKE ?
                    OR e.last_name LIKE ?
                    OR e.employee_code LIKE ?
                    OR e.email LIKE ?
                )
            `;

            const searchValue = `%${search}%`;

            params.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );
        }

        // Filter department
        if (department_id) {
            query += `
                AND e.department_id = ?
            `;

            params.push(department_id);
        }

        // Filter status
        if (status) {
            query += `
                AND a.status = ?
            `;

            params.push(status);
        }

        query += `
            ORDER BY
                a.attendance_date DESC,
                a.check_in DESC
        `;

        const [attendance] = await pool.execute(
            query,
            params
        );

        return res.status(200).json({
            success: true,
            count: attendance.length,
            attendance,
        });

    } catch (error) {
        console.error(
            "Get attendance error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while fetching attendance",
            error: error.message,
        });
    }
};


/**
 * GET /api/attendance/:id
 * Get single attendance record
 */
const getAttendanceById = async (req, res) => {
    try {
        const { id } = req.params;

        const [attendance] = await pool.execute(
            `
            SELECT
                a.id,
                a.employee_id,
                a.attendance_date,
                a.check_in,
                a.check_out,
                a.check_in_latitude,
                a.check_in_longitude,
                a.check_out_latitude,
                a.check_out_longitude,
                a.location_address,
                a.status,
                a.working_hours,

                e.employee_code,
                e.first_name,
                e.last_name,
                e.email,
                e.phone,
                e.position,
                e.profile_photo,

                d.id AS department_id,
                d.name AS department_name

            FROM attendance a

            INNER JOIN employees e
                ON a.employee_id = e.id

            LEFT JOIN departments d
                ON e.department_id = d.id

            WHERE a.id = ?

            LIMIT 1
            `,
            [id]
        );

        if (attendance.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Attendance record not found",
            });
        }

        return res.status(200).json({
            success: true,
            attendance: attendance[0],
        });

    } catch (error) {
        console.error(
            "Get attendance by ID error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while fetching attendance record",
            error: error.message,
        });
    }
};


/**
 * POST /api/attendance/check-in
 * Employee check-in
 */
const checkIn = async (req, res) => {
    try {
        const {
            employee_id,
            latitude,
            longitude,
            location_address,
        } = req.body;

        if (!employee_id) {
            return res.status(400).json({
                success: false,
                message: "Employee ID is required",
            });
        }

        // Check employee exists
        const [employees] = await pool.execute(
            `
            SELECT
                id,
                employee_code,
                first_name,
                last_name,
                status
            FROM employees
            WHERE id = ?
            LIMIT 1
            `,
            [employee_id]
        );

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        const employee = employees[0];

        // Check employee status
        if (employee.status !== "Active") {
            return res.status(403).json({
                success: false,
                message:
                    "Employee account is not active",
            });
        }

        // Check if employee already checked in today
        const [existingAttendance] =
            await pool.execute(
                `
                SELECT
                    id,
                    check_in,
                    check_out,
                    status
                FROM attendance
                WHERE employee_id = ?
                AND attendance_date = CURDATE()
                LIMIT 1
                `,
                [employee_id]
            );

        if (existingAttendance.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "Employee has already checked in today",
                attendance:
                    existingAttendance[0],
            });
        }

        /*
         * Get current time.
         *
         * We use CURTIME() instead of selecting
         * a column/alias named current_time.
         */
        const [timeResult] = await pool.execute(
            `
            SELECT CURTIME() AS check_in_time
            `
        );

        const checkInTime =
            timeResult[0].check_in_time;

        /*
         * Late threshold:
         * 09:15:00
         */
        const lateTime = "09:15:00";

        const status =
            String(checkInTime) > lateTime
                ? "Late"
                : "Present";

        // Insert attendance
        const [result] = await pool.execute(
            `
            INSERT INTO attendance
            (
                employee_id,
                attendance_date,
                check_in,
                check_in_latitude,
                check_in_longitude,
                location_address,
                status
            )
            VALUES
            (
                ?,
                CURDATE(),
                NOW(),
                ?,
                ?,
                ?,
                ?
            )
            `,
            [
                employee_id,
                latitude || null,
                longitude || null,
                location_address || null,
                status,
            ]
        );

        return res.status(201).json({
            success: true,
            message:
                "Employee checked in successfully",

            attendance: {
                id: result.insertId,
                employee_id,
                employee_code:
                    employee.employee_code,
                employee_name:
                    `${employee.first_name} ${employee.last_name}`,
                attendance_date:
                    new Date()
                        .toISOString()
                        .split("T")[0],
                check_in: checkInTime,
                status,
                latitude:
                    latitude || null,
                longitude:
                    longitude || null,
                location_address:
                    location_address || null,
            },
        });

    } catch (error) {
        console.error(
            "Check-in error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error during check-in",
            error: error.message,
        });
    }
};


/**
 * PUT /api/attendance/:id/check-out
 * Employee check-out
 */
const checkOut = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            latitude,
            longitude,
            location_address,
        } = req.body;

        // Find attendance record
        const [attendance] =
            await pool.execute(
                `
                SELECT
                    id,
                    employee_id,
                    attendance_date,
                    check_in,
                    check_out,
                    status
                FROM attendance
                WHERE id = ?
                LIMIT 1
                `,
                [id]
            );

        if (attendance.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Attendance record not found",
            });
        }

        const record = attendance[0];

        // Check already checked out
        if (record.check_out) {
            return res.status(409).json({
                success: false,
                message:
                    "Employee has already checked out",
                attendance: record,
            });
        }

        if (!record.check_in) {
            return res.status(400).json({
                success: false,
                message:
                    "Employee has not checked in yet",
            });
        }

        /*
         * Calculate working hours.
         *
         * TIMESTAMPDIFF returns minutes between
         * check-in and current time.
         */
        const [timeResult] =
            await pool.execute(
                `
                SELECT
                    ROUND(
                        TIMESTAMPDIFF(
                            MINUTE,
                            check_in,
                            NOW()
                        ) / 60,
                        2
                    ) AS working_hours
                FROM attendance
                WHERE id = ?
                `,
                [id]
            );

        const workingHours =
            timeResult[0].working_hours;

        // Update checkout
        await pool.execute(
            `
            UPDATE attendance
            SET
                check_out = NOW(),
                check_out_latitude = ?,
                check_out_longitude = ?,
                location_address = ?,
                working_hours = ?
            WHERE id = ?
            `,
            [
                latitude || null,
                longitude || null,
                location_address ||
                    null,
                workingHours,
                id,
            ]
        );

        return res.status(200).json({
            success: true,
            message:
                "Employee checked out successfully",

            attendance: {
                id: Number(id),
                employee_id:
                    record.employee_id,
                check_out:
                    new Date(),
                working_hours:
                    workingHours,
                latitude:
                    latitude || null,
                longitude:
                    longitude || null,
                location_address:
                    location_address ||
                    null,
            },
        });

    } catch (error) {
        console.error(
            "Check-out error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error during check-out",
            error: error.message,
        });
    }
};


/**
 * PUT /api/attendance/:id
 * Update attendance manually
 */
const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            attendance_date,
            check_in,
            check_out,
            status,
            working_hours,
            check_in_latitude,
            check_in_longitude,
            check_out_latitude,
            check_out_longitude,
            location_address,
        } = req.body;

        // Check record exists
        const [existing] =
            await pool.execute(
                `
                SELECT id
                FROM attendance
                WHERE id = ?
                LIMIT 1
                `,
                [id]
            );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Attendance record not found",
            });
        }

        // Build dynamic update
        const fields = [];
        const values = [];

        if (attendance_date !== undefined) {
            fields.push(
                "attendance_date = ?"
            );
            values.push(attendance_date);
        }

        if (check_in !== undefined) {
            fields.push(
                "check_in = ?"
            );
            values.push(check_in);
        }

        if (check_out !== undefined) {
            fields.push(
                "check_out = ?"
            );
            values.push(check_out);
        }

        if (status !== undefined) {
            fields.push(
                "status = ?"
            );
            values.push(status);
        }

        if (working_hours !== undefined) {
            fields.push(
                "working_hours = ?"
            );
            values.push(working_hours);
        }

        if (
            check_in_latitude !== undefined
        ) {
            fields.push(
                "check_in_latitude = ?"
            );
            values.push(
                check_in_latitude
            );
        }

        if (
            check_in_longitude !== undefined
        ) {
            fields.push(
                "check_in_longitude = ?"
            );
            values.push(
                check_in_longitude
            );
        }

        if (
            check_out_latitude !== undefined
        ) {
            fields.push(
                "check_out_latitude = ?"
            );
            values.push(
                check_out_latitude
            );
        }

        if (
            check_out_longitude !== undefined
        ) {
            fields.push(
                "check_out_longitude = ?"
            );
            values.push(
                check_out_longitude
            );
        }

        if (
            location_address !== undefined
        ) {
            fields.push(
                "location_address = ?"
            );
            values.push(
                location_address
            );
        }

        if (fields.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "No fields provided for update",
            });
        }

        values.push(id);

        await pool.execute(
            `
            UPDATE attendance
            SET ${fields.join(", ")}
            WHERE id = ?
            `,
            values
        );

        // Return updated record
        const [updated] =
            await pool.execute(
                `
                SELECT
                    a.*,

                    e.employee_code,
                    e.first_name,
                    e.last_name,

                    d.name AS department_name

                FROM attendance a

                INNER JOIN employees e
                    ON a.employee_id = e.id

                LEFT JOIN departments d
                    ON e.department_id = d.id

                WHERE a.id = ?

                LIMIT 1
                `,
                [id]
            );

        return res.status(200).json({
            success: true,
            message:
                "Attendance updated successfully",
            attendance:
                updated[0],
        });

    } catch (error) {
        console.error(
            "Update attendance error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while updating attendance",
            error: error.message,
        });
    }
};


/**
 * DELETE /api/attendance/:id
 * Delete attendance record
 */
const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] =
            await pool.execute(
                `
                SELECT id
                FROM attendance
                WHERE id = ?
                LIMIT 1
                `,
                [id]
            );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Attendance record not found",
            });
        }

        await pool.execute(
            `
            DELETE FROM attendance
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message:
                "Attendance deleted successfully",
        });

    } catch (error) {
        console.error(
            "Delete attendance error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while deleting attendance",
            error: error.message,
        });
    }
};


/**
 * Export all controller functions
 */
module.exports = {
    getAttendance,
    getAttendanceById,
    checkIn,
    checkOut,
    updateAttendance,
    deleteAttendance,
};