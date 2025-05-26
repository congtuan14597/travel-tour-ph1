const express = require("express");
const router = express.Router();
const {
  userAuthenticateToken,
  requireEmployeeRole,
  requireCollaboratorRole,
} = require("../middleware/user_authentication_middleware");
const userLoginController = require("../controllers/user/login");
const userLogoutController = require("../controllers/user/logout");
const employeeController = require("../controllers/user/employees");
const collaboratorController = require("../controllers/user/collaborators")

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
// FOR COLLABORATOR
router.get("/collaborators/edit",
  userAuthenticateToken,
  requireCollaboratorRole,
  collaboratorController.editCollaborator
);
router.patch("/collaborators/:id/update",
  userAuthenticateToken,
  requireCollaboratorRole,
  collaboratorController.updateCollaborator
);

module.exports = router;
