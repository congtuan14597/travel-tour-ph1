const express = require("express");
const router = express.Router();
const performAnalysisFileController = require("../controllers/admin/api/perform_analysis_file.js");
const adminLoginController = require("../controllers/admin/login.js");
const analysisDocumentsContrtoller = require("../controllers/admin/analysis_documents.js");

// FOR LOGIN
router.get("/", adminLoginController.getAdminLogin);
router.get("/login", adminLoginController.getAdminLogin);
router.post("/login", adminLoginController.postAdminLogin);
// FOR SIGN UP
router.get("/signup", adminLoginController.getAdminSignUp);
// FOR ANALYSIS DOCUMENTS
router.get("/analysis_documents", analysisDocumentsContrtoller.getAnalysisDocuments);
// FOR API
router.post("/api/v1/files/perform_analysis", performAnalysisFileController.perform);

module.exports = router;
