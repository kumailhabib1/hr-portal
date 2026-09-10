const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

/*
|--------------------------------------------------------------------------
| Upload Employee Documents
|--------------------------------------------------------------------------
*/

const uploadDocuments = async (req, res) => {
    try {
        const { employeeId } = req.params;

        /*
        |--------------------------------------------------------------------------
        | Validate Employee ID
        |--------------------------------------------------------------------------
        */

        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: "Employee ID is required",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Check Employee
        |--------------------------------------------------------------------------
        */

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

        /*
        |--------------------------------------------------------------------------
        | Check Files
        |--------------------------------------------------------------------------
        */

        const files = req.files || [];

        if (files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No documents were uploaded",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Get Document Types
        |--------------------------------------------------------------------------
        */

        const documentTypes = [];

        for (let i = 0; i < files.length; i++) {
            documentTypes.push(
                req.body[`document_type_${i}`] ||
                "Other Document"
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Save Documents
        |--------------------------------------------------------------------------
        */

        const savedDocuments = [];

        for (
            let i = 0;
            i < files.length;
            i++
        ) {
            const file = files[i];

            const documentType =
                documentTypes[i];

            /*
            |--------------------------------------------------------------------------
            | Relative Path
            |--------------------------------------------------------------------------
            */

            const relativePath = path
                .join(
                    "uploads",
                    "documents",
                    file.filename
                )
                .replace(/\\/g, "/");

            /*
            |--------------------------------------------------------------------------
            | Insert Database Record
            |--------------------------------------------------------------------------
            */

            const [result] =
                await pool.execute(
                    `
                    INSERT INTO documents
                    (
                        employee_id,
                        document_type,
                        document_name,
                        file_path,
                        uploaded_by,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?, 'Pending')
                    `,
                    [
                        employeeId,
                        documentType,
                        file.originalname,
                        relativePath,
                        req.user.id,
                    ]
                );

            savedDocuments.push({
                id: result.insertId,
                employee_id: Number(
                    employeeId
                ),
                document_type:
                    documentType,
                document_name:
                    file.originalname,
                file_path:
                    relativePath,
                size: file.size,
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return res.status(201).json({
            success: true,
            message:
                "Documents uploaded successfully",
            count: savedDocuments.length,
            documents:
                savedDocuments,
        });

    } catch (error) {
        console.error(
            "Document upload error:",
            error
        );

        /*
        |--------------------------------------------------------------------------
        | Remove Uploaded Files If DB Fails
        |--------------------------------------------------------------------------
        */

        if (req.files) {
            for (const file of req.files) {
                try {
                    if (
                        fs.existsSync(
                            file.path
                        )
                    ) {
                        fs.unlinkSync(
                            file.path
                        );
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
| Get Employee Documents
|--------------------------------------------------------------------------
*/

const getEmployeeDocuments = async (
    req,
    res
) => {
    try {
        const { employeeId } =
            req.params;

        const [documents] =
            await pool.execute(
                `
                SELECT
                    d.id,
                    d.employee_id,
                    d.document_type,
                    d.document_name,
                    d.file_path,
                    d.status,
                    d.uploaded_at,
                    u.email AS uploaded_by_email
                FROM documents d
                LEFT JOIN users u
                    ON d.uploaded_by = u.id
                WHERE d.employee_id = ?
                ORDER BY d.uploaded_at DESC
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
        });
    }
};

/*
|--------------------------------------------------------------------------
| Delete Document
|--------------------------------------------------------------------------
*/

const deleteDocument = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        const [documents] =
            await pool.execute(
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

        const document =
            documents[0];

        /*
        |--------------------------------------------------------------------------
        | Delete Physical File
        |--------------------------------------------------------------------------
        */

        const filePath = path.join(
            __dirname,
            "../../",
            document.file_path
        );

        if (
            fs.existsSync(filePath)
        ) {
            fs.unlinkSync(filePath);
        }

        /*
        |--------------------------------------------------------------------------
        | Delete Database Record
        |--------------------------------------------------------------------------
        */

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
        });
    }
};

module.exports = {
    uploadDocuments,
    getEmployeeDocuments,
    deleteDocument,
};