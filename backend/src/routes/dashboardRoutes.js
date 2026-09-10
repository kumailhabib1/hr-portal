const express = require("express");

const {
    uploadDocuments,
    getEmployeeDocuments,
    deleteDocument,
} = require("../controllers/documentController");

const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/documentUpload");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Upload documents
|--------------------------------------------------------------------------
*/

router.post(
    "/employee/:employeeId",
    authMiddleware,
    upload.array("documents", 10),
    uploadDocuments
);

/*
|--------------------------------------------------------------------------
| Get employee documents
|--------------------------------------------------------------------------
*/

router.get(
    "/employee/:employeeId",
    authMiddleware,
    getEmployeeDocuments
);

/*
|--------------------------------------------------------------------------
| Delete document
|--------------------------------------------------------------------------
*/

router.delete(
    "/:id",
    authMiddleware,
    deleteDocument
);

module.exports = router;