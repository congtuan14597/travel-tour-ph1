const express = require("express");
const router = express.Router();
const performAnalysisFileController = require("../controllers/admin/api/perform_analysis_file.js");
const adminLoginController = require("../controllers/admin/login.js");
const adminLogoutController = require("../controllers/admin/logout.js");
// const documentExportHistoriesContrtoller = require("../controllers/admin/document_export_histories.js");
const authenticateToken = require('../middleware/admin_authentication_middleware');

const multer = require('multer');
const uploadService = require("../controllers/admin/api/upload_service.js");
var path = require("path");

// Multer setup for file uploads
const upload = multer({ dest: path.join(__dirname, '../uploads/temp') });
const analysisDocumentsContrtoller = require("../controllers/admin/analysis_documents.js");

// FOR LOGIN
router.get("/", adminLoginController.getAdminLogin);
router.get("/login", adminLoginController.getAdminLogin);
router.post("/login", adminLoginController.postAdminLogin);
// FOR SIGN UP
router.get("/signup", adminLoginController.getAdminSignUp);
// FOR ANALYSIS DOCUMENTS
router.get("/analysis_documents",authenticateToken, analysisDocumentsContrtoller.getAnalysisDocuments);
// FOR API
router.post("/api/v1/files/perform_analysis", performAnalysisFileController.perform);

router.post("/logout", adminLogoutController.postAdminLogout);

module.exports = router;
