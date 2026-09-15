const multer = require("multer");
const path = require("path");
const fs = require("fs");

// backend/uploads/documents
const uploadDir = path.resolve(
    __dirname,
    "../../uploads/documents"
);

// Always make sure folder exists
fs.mkdirSync(uploadDir, {
    recursive: true,
});

console.log("Document upload directory:", uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            fs.mkdirSync(uploadDir, {
                recursive: true,
            });

            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },

    filename: (req, file, cb) => {
        const extension = path
            .extname(file.originalname)
            .toLowerCase();

        const filename =
            `${Date.now()}-${Math.round(
                Math.random() * 1000000000
            )}${extension}`;

        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = [
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png",
        ".doc",
        ".docx",
    ];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    if (allowedExtensions.includes(extension)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PDF, JPG, JPEG, PNG, DOC and DOCX files are allowed."
            )
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10,
    },
});

module.exports = upload;