const pool = require("../config/db");

const getDepartments = async (req, res) => {
    try {
        const [departments] = await pool.execute(
            `SELECT
                id,
                name,
                description,
                status
             FROM departments
             ORDER BY name ASC`
        );

        res.status(200).json({
            success: true,
            count: departments.length,
            departments,
        });
    } catch (error) {
        console.error("Get departments error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load departments",
            error: error.message,
        });
    }
};

module.exports = {
    getDepartments,
};