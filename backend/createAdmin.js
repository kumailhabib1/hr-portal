const bcrypt = require("bcryptjs");
const pool = require("./src/config/db");

const createAdmin = async () => {
    try {
        const email = "admin@hrportal.com";
        const password = "Admin@123";
        const role = "Admin";

        // Check if admin already exists
        const [existing] = await pool.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            console.log("Admin user already exists.");
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert admin
        const [result] = await pool.execute(
            `INSERT INTO users
            (employee_id, email, password, role, status)
            VALUES (?, ?, ?, ?, ?)`,
            [
                null,
                email,
                hashedPassword,
                role,
                "Active",
            ]
        );

        console.log("Admin created successfully!");
        console.log("ID:", result.insertId);
        console.log("Email:", email);
        console.log("Password:", password);

        process.exit(0);

    } catch (error) {
        console.error("Failed to create admin:");
        console.error(error.message);

        process.exit(1);
    }
};

createAdmin();