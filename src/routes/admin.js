const express = require("express");
const router = express.Router();
const performAnalysisFileController = require("../controllers/admin/api/perform_analysis_file.js");
const adminLoginController = require("../controllers/admin/login.js");
const adminLogoutController = require("../controllers/admin/logout.js");
const adminAuthentication = require('../middleware/admin_authentication_middleware');
const analysisDocumentsContrtoller = require("../controllers/admin/analysis_documents.js");
const analysisImagesContrtoller = require("../controllers/admin/analysis_images.js");
const documentExportHistoriesController = require("../controllers/admin/document_export_hitories.js");

// FOR LOGIN
router.get("/", adminLoginController.getAdminLogin);
router.get("/login", adminLoginController.getAdminLogin);
router.post("/login", adminLoginController.postAdminLogin);
// FOR LOGOUT
router.post("/logout", adminLogoutController.postAdminLogout);
// FOR SIGN UP
router.get("/signup", adminLoginController.getAdminSignUp);
// FOR ANALYSIS DOCUMENTS
router.get("/analysis_documents", adminAuthentication, analysisDocumentsContrtoller.getAnalysisDocuments);
router.get("/analysis_images", adminAuthentication, analysisImagesContrtoller.getAnalysisImages);
router.get("/document_export_hitories", adminAuthentication, documentExportHistoriesController.getDocumentExportHistories);
router.get("/document_export_hitories/:id", adminAuthentication, documentExportHistoriesController.downloadDocumentExportHistories);
// FOR API
router.post("/api/v1/files/perform_analysis", performAnalysisFileController.perform);

module.exports = router;
