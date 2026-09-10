const multer = require("multer");
const path = require("path");
const fs = require("fs");

/*
|--------------------------------------------------------------------------
| Upload Directory
|--------------------------------------------------------------------------
*/

const uploadDir = path.join(
    __dirname,
    "../../uploads/documents"
);

/*
|--------------------------------------------------------------------------
| Automatically Create Folder
|--------------------------------------------------------------------------
*/

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true,
    });

    console.log(
        "Created upload directory:",
        uploadDir
    );
}

/*
|--------------------------------------------------------------------------
| Storage
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        /*
         * Check again before every upload.
         * This protects against the folder being deleted
         * while the server is running.
         */

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {
                recursive: true,
            });
        }

        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const extension =
            path.extname(file.originalname);

        const randomName =
            `${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}${extension}`;

        cb(null, randomName);
    },
});

/*
|--------------------------------------------------------------------------
| File Filter
|--------------------------------------------------------------------------
*/

const fileFilter = (req, file, cb) => {
    const allowedExtensions = [
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png",
        ".doc",
        ".docx",
    ];

    const extension =
        path.extname(
            file.originalname
        ).toLowerCase();

    if (
        allowedExtensions.includes(
            extension
        )
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PDF, JPG, JPEG, PNG, DOC and DOCX files are allowed."
            ),
            false
        );
    }
};

/*
|--------------------------------------------------------------------------
| Multer
|--------------------------------------------------------------------------
*/

const upload = multer({
    storage,

    fileFilter,

    limits: {
        fileSize:
            10 * 1024 * 1024, // 10MB
        files: 10,
    },
});

module.exports = upload;