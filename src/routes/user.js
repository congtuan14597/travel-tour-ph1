const express = require("express");
const router = express.Router();
const userLoginController = require("../controllers/user/login");
const userLogoutController = require("../controllers/user/logout");

// FOR LOGIN
router.get("/", userLoginController.getUserLogin);
router.get("/login", userLoginController.getUserLogin);
router.post("/login", userLoginController.postUserLogin);
// FOR LOGOUT
router.post("logout", userLogoutController.postUserLogout);
// FOR SIGNUP
router.get("/signup", userLoginController.getUserSignUp);

module.exports = router;
