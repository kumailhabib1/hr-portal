const express = require("express");

const {
    getEmployeeProfile,
    updateEmployeeProfile,
    changeEmployeePassword,
} = require("../controllers/employeeProfileController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Employee Profile Routes
|--------------------------------------------------------------------------
|
| All routes require a valid JWT.
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| GET EMPLOYEE PROFILE
|--------------------------------------------------------------------------
|
| GET /api/employee/profile
|
*/

router.get(
    "/profile",
    authMiddleware,
    getEmployeeProfile
);


/*
|--------------------------------------------------------------------------
| UPDATE EMPLOYEE PROFILE
|--------------------------------------------------------------------------
|
| PUT /api/employee/profile
|
*/

router.put(
    "/profile",
    authMiddleware,
    updateEmployeeProfile
);


/*
|--------------------------------------------------------------------------
| CHANGE EMPLOYEE PASSWORD
|--------------------------------------------------------------------------
|
| PUT /api/employee/password
|
*/

router.put(
    "/password",
    authMiddleware,
    changeEmployeePassword
);


module.exports = router;