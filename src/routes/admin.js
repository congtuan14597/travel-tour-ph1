const express = require("express");
const router = express.Router();
const performAnalysisFileController = require("../controllers/admin/api/perform_analysis_file.js");
const adminLoginController = require("../controllers/admin/login.js");
const adminLogoutController = require("../controllers/admin/logout.js");
const authenticateToken = require('../middleware/admin_authentication_middleware');
const analysisDocumentsContrtoller = require("../controllers/admin/analysis_documents.js");

// FOR LOGIN
router.get("/", adminLoginController.getAdminLogin);
router.get("/login", adminLoginController.getAdminLogin);
router.post("/login", adminLoginController.postAdminLogin);
// FOR LOGOUT
router.post("/logout", adminLogoutController.postAdminLogout);
// FOR SIGN UP
router.get("/signup", adminLoginController.getAdminSignUp);
// FOR ANALYSIS DOCUMENTS
router.get("/analysis_documents", authenticateToken, analysisDocumentsContrtoller.getAnalysisDocuments);
// FOR API
router.post("/api/v1/files/perform_analysis", performAnalysisFileController.perform);

module.exports = router;
