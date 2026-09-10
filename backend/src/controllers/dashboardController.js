const pool = require("../config/db");

const getDashboardSummary = async (req, res) => {
    try {
        // Total, active and new employees
        const [[employeeStats]] = await pool.execute(`
            SELECT
                COUNT(*) AS totalEmployees,

                SUM(
                    CASE
                        WHEN status = 'Active'
                        THEN 1
                        ELSE 0
                    END
                ) AS activeEmployees,

                SUM(
                    CASE
                        WHEN joining_date IS NOT NULL
                        AND MONTH(joining_date) = MONTH(CURDATE())
                        AND YEAR(joining_date) = YEAR(CURDATE())
                        THEN 1
                        ELSE 0
                    END
                ) AS newEmployees

            FROM employees
        `);

        // Employees currently on approved leave
        const [[leaveStats]] = await pool.execute(`
            SELECT COUNT(*) AS onLeave
            FROM leaves
            WHERE status = 'Approved'
            AND CURDATE() BETWEEN start_date AND end_date
        `);

        // Departments
        const [[departmentStats]] = await pool.execute(`
            SELECT COUNT(*) AS departments
            FROM departments
        `);

        // Today's attendance
        const [[todayAttendance]] = await pool.execute(`
            SELECT

                COUNT(
                    CASE
                        WHEN status IN ('Present', 'Late')
                        THEN 1
                    END
                ) AS presentToday,

                COUNT(
                    CASE
                        WHEN status = 'Late'
                        THEN 1
                    END
                ) AS lateToday,

                COUNT(
                    CASE
                        WHEN status = 'Absent'
                        THEN 1
                    END
                ) AS absentToday

            FROM attendance

            WHERE attendance_date = CURDATE()
        `);

        const totalEmployees =
            Number(employeeStats.totalEmployees) || 0;

        const activeEmployees =
            Number(employeeStats.activeEmployees) || 0;

        const newEmployees =
            Number(employeeStats.newEmployees) || 0;

        const onLeave =
            Number(leaveStats.onLeave) || 0;

        const presentToday =
            Number(todayAttendance.presentToday) || 0;

        const lateToday =
            Number(todayAttendance.lateToday) || 0;

        const absentToday =
            Number(todayAttendance.absentToday) || 0;

        const departments =
            Number(departmentStats.departments) || 0;

        // Attendance percentage
        let attendanceRate = 0;

        if (totalEmployees > 0) {
            attendanceRate = Number(
                (
                    (presentToday / totalEmployees) *
                    100
                ).toFixed(1)
            );
        }

        // Weekly attendance
        const [weeklyAttendance] = await pool.execute(`
            SELECT
                DAYNAME(attendance_date) AS day,

                COUNT(
                    CASE
                        WHEN status IN ('Present', 'Late')
                        THEN 1
                    END
                ) AS present,

                COUNT(
                    CASE
                        WHEN status = 'Absent'
                        THEN 1
                    END
                ) AS absent,

                COUNT(
                    CASE
                        WHEN status = 'Leave'
                        THEN 1
                    END
                ) AS leaveCount

            FROM attendance

            WHERE attendance_date >=
                DATE_SUB(CURDATE(), INTERVAL 6 DAY)

            AND attendance_date <= CURDATE()

            GROUP BY
                attendance_date,
                DAYNAME(attendance_date)

            ORDER BY attendance_date ASC
        `);

        // Recent employees
        const [recentEmployees] = await pool.execute(`
            SELECT
                e.id,
                e.first_name,
                e.last_name,
                e.position,
                e.profile_photo,
                e.joining_date,
                d.name AS department

            FROM employees e

            LEFT JOIN departments d
                ON e.department_id = d.id

            ORDER BY e.id DESC

            LIMIT 5
        `);

        // Workforce distribution
        const [workforce] = await pool.execute(`
            SELECT
                employment_type,
                COUNT(*) AS total

            FROM employees

            GROUP BY employment_type
        `);

        const workforceSummary = {
            fullTime: 0,
            partTime: 0,
            interns: 0,
        };

        workforce.forEach((item) => {
            const type = String(
                item.employment_type || ""
            ).toLowerCase();

            if (type.includes("full")) {
                workforceSummary.fullTime +=
                    Number(item.total);
            }

            if (type.includes("part")) {
                workforceSummary.partTime +=
                    Number(item.total);
            }

            if (type.includes("intern")) {
                workforceSummary.interns +=
                    Number(item.total);
            }
        });

        res.status(200).json({
            success: true,

            stats: {
                totalEmployees,
                activeEmployees,
                onLeave,
                newEmployees,
            },

            attendance: {
                presentToday,
                absentToday,
                lateToday,
                attendanceRate,
                weekly: weeklyAttendance,
            },

            departments,

            recentEmployees,

            workforce: workforceSummary,
        });

    } catch (error) {
        console.error(
            "Dashboard controller error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard data",
            error: error.message,
        });
    }
};

module.exports = {
    getDashboardSummary,
};