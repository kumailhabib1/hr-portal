const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

const uploadDocuments = async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: "Employee ID is required",
            });
        }

        // Check employee exists
        const [employees] = await pool.execute(
            `
            SELECT id
            FROM employees
            WHERE id = ?
            LIMIT 1
            `,
            [employeeId]
        );

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        const files = req.files || [];

        if (files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No documents were uploaded",
            });
        }

        const savedDocuments = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            /*
             * Frontend sends:
             * document_type_0
             * document_type_1
             * etc.
             */
            const frontendType =
                req.body[`document_type_${i}`] ||
                "Other";

            /*
             * Your database allows only:
             * Personal
             * Contracts
             * Payroll
             * Attendance
             * Performance
             * Other
             */

            let documentCategory = "Other";

            if (
                frontendType === "CNIC / National ID" ||
                frontendType === "Resume / CV" ||
                frontendType === "Educational Certificate"
            ) {
                documentCategory = "Personal";
            } else if (
                frontendType === "Employment Contract"
            ) {
                documentCategory = "Contracts";
            }

            const relativePath = path
                .join(
                    "uploads",
                    "documents",
                    file.filename
                )
                .replace(/\\/g, "/");

            const [result] = await pool.execute(
                `
                INSERT INTO documents
                (
                    employee_id,
                    document_name,
                    document_category,
                    file_name,
                    file_path,
                    file_type,
                    file_size,
                    uploaded_by,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
                `,
                [
                    employeeId,
                    frontendType,
                    documentCategory,
                    file.filename,
                    relativePath,
                    file.mimetype,
                    file.size,
                    req.user.id,
                ]
            );

            savedDocuments.push({
                id: result.insertId,
                employee_id: Number(employeeId),
                document_name: frontendType,
                document_category: documentCategory,
                file_name: file.filename,
                file_path: relativePath,
                file_type: file.mimetype,
                file_size: file.size,
                status: "Pending",
            });
        }

        return res.status(201).json({
            success: true,
            message: "Documents uploaded successfully",
            count: savedDocuments.length,
            documents: savedDocuments,
        });

    } catch (error) {
        console.error(
            "Document upload error:",
            error
        );

        // Remove uploaded files if database insertion fails
        if (req.files) {
            for (const file of req.files) {
                try {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                } catch (deleteError) {
                    console.error(
                        "Could not remove uploaded file:",
                        deleteError.message
                    );
                }
            }
        }

        return res.status(500).json({
            success: false,
            message:
                "Server error while uploading documents",
            error: error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| GET EMPLOYEE DOCUMENTS
|--------------------------------------------------------------------------
*/

const getEmployeeDocuments = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const [documents] = await pool.execute(
            `
            SELECT
                d.id,
                d.employee_id,
                d.document_name,
                d.document_category,
                d.file_name,
                d.file_path,
                d.file_type,
                d.file_size,
                d.status,
                d.uploaded_by,
                d.created_at,
                u.email AS uploaded_by_email
            FROM documents d
            LEFT JOIN users u
                ON d.uploaded_by = u.id
            WHERE d.employee_id = ?
            ORDER BY d.created_at DESC
            `,
            [employeeId]
        );

        return res.status(200).json({
            success: true,
            count: documents.length,
            documents,
        });

    } catch (error) {
        console.error(
            "Get documents error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load employee documents",
            error: error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| DELETE DOCUMENT
|--------------------------------------------------------------------------
*/

const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const [documents] = await pool.execute(
            `
            SELECT
                id,
                file_path
            FROM documents
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (documents.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }

        const document = documents[0];

        const filePath = path.resolve(
            __dirname,
            "../../",
            document.file_path
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await pool.execute(
            `
            DELETE FROM documents
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message:
                "Document deleted successfully",
        });

    } catch (error) {
        console.error(
            "Delete document error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to delete document",
            error: error.message,
        });
    }
};


module.exports = {
    uploadDocuments,
    getEmployeeDocuments,
    deleteDocument,
};