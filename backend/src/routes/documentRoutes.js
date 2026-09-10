const express = require("express");

const {
    uploadDocuments,
} = require("../controllers/documentController");

const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/documentUpload");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Upload Employee Documents
|--------------------------------------------------------------------------
*/

router.post(
    "/employee/:employeeId",
    authMiddleware,
    upload.array("documents", 10),
    uploadDocuments
);

module.exports = router;