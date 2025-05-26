const express = require("express");
const router = express.Router();
const {
  userAuthenticateToken,
  requireEmployeeRole
} = require("../middleware/user_authentication_middleware");
const userLoginController = require("../controllers/user/login");
const userLogoutController = require("../controllers/user/logout");
const employeeController = require("../controllers/user/employees");

// FOR LOGIN
router.get("/", userLoginController.getUserLogin);
router.get("/login", userLoginController.getUserLogin);
router.post("/login", userLoginController.postUserLogin);
// FOR LOGOUT
router.post("/logout", userLogoutController.postUserLogout);
// FOR SIGNUP
router.get("/signup", userLoginController.getUserSignUp);
// FOR EMPLOYEE
router.get("/employees/edit",
  userAuthenticateToken,
  requireEmployeeRole,
  employeeController.editEmployee
);
router.patch("/employees/:id/update",
  userAuthenticateToken,
  requireEmployeeRole,
  employeeController.updateEmployee
);

module.exports = router;
