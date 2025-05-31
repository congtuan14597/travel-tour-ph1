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
const collaboratorController = require("../controllers/user/collaborators");
const tourController = require("../controllers/user/tours");

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
// FOR TOUR
router.get("/tours", userAuthenticateToken, tourController.getTours);
router.get("/tours/:id/edit",
  userAuthenticateToken,
  tourController.getTourDetails
);
router.get('/tours/completed_bookings',
  userAuthenticateToken,
  tourController.getCompletedBookingsByMonth
);

module.exports = router;
