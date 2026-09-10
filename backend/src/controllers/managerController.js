const pool = require("../config/db");

const getManagers = async (req, res) => {
    try {
        const { department_id } = req.query;

        let query = `
            SELECT
                e.id,
                e.employee_code,
                e.first_name,
                e.last_name,
                e.email,
                e.position,
                e.department_id,
                d.name AS department_name
            FROM employees e
            LEFT JOIN departments d
                ON e.department_id = d.id
            WHERE e.status = 'Active'
            AND (
                e.position LIKE '%Manager%'
                OR e.position LIKE '%Lead%'
                OR e.position LIKE '%Head%'
            )
        `;

        const params = [];

        if (department_id) {
            query += ` AND e.department_id = ?`;
            params.push(department_id);
        }

        query += ` ORDER BY e.first_name ASC, e.last_name ASC`;

        const [managers] = await pool.execute(query, params);

        res.status(200).json({
            success: true,
            count: managers.length,
            managers,
        });

    } catch (error) {
        console.error("Get managers error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load managers",
        });
    }
};

module.exports = {
    getManagers,
};