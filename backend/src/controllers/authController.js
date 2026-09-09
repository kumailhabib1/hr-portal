const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

/**
 * Generate JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
            employee_id: user.employee_id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
    );
};

/**
 * POST /api/auth/register
 * Register a new user
 */
const register = async (req, res) => {
    try {
        const {
            employee_id,
            email,
            password,
            role = "Employee",
        } = req.body;

        // Required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long",
            });
        }

        // Check existing email
        const [existingUser] = await pool.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        // If employee_id is provided, verify employee exists
        if (employee_id) {
            const [employee] = await pool.execute(
                "SELECT id FROM employees WHERE id = ?",
                [employee_id]
            );

            if (employee.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Employee not found",
                });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const [result] = await pool.execute(
            `INSERT INTO users
            (employee_id, email, password, role, status)
            VALUES (?, ?, ?, ?, 'Active')`,
            [
                employee_id || null,
                email,
                hashedPassword,
                role,
            ]
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: result.insertId,
        });

    } catch (error) {
        console.error("Register error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during registration",
        });
    }
};


/**
 * POST /api/auth/login
 * Login user
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user
        const [users] = await pool.execute(
            `SELECT
                u.id,
                u.employee_id,
                u.email,
                u.password,
                u.role,
                u.status,
                e.first_name,
                e.last_name,
                e.employee_code,
                e.department_id,
                e.position
            FROM users u
            LEFT JOIN employees e
                ON u.employee_id = e.id
            WHERE u.email = ?
            LIMIT 1`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const user = users[0];

        // Check account status
        if (user.status !== "Active") {
            return res.status(403).json({
                success: false,
                message: `Your account is ${user.status.toLowerCase()}`,
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate token
        const token = generateToken(user);

        // Remove password before sending response
        delete user.password;

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user,
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
};


/**
 * GET /api/auth/me
 * Get currently authenticated user
 */
const getMe = async (req, res) => {
    try {
        const [users] = await pool.execute(
            `SELECT
                u.id,
                u.employee_id,
                u.email,
                u.role,
                u.status,
                e.first_name,
                e.last_name,
                e.employee_code,
                e.department_id,
                e.position,
                e.profile_photo
            FROM users u
            LEFT JOIN employees e
                ON u.employee_id = e.id
            WHERE u.id = ?
            LIMIT 1`,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user: users[0],
        });

    } catch (error) {
        console.error("Get user error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


/**
 * Logout
 *
 * JWT is stateless, so the frontend removes the token.
 */
const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
};


module.exports = {
    register,
    login,
    getMe,
    logout,
};