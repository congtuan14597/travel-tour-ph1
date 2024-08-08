const express = require("express");
const router = express.Router();
const performAnalysisFileController = require("../controllers/admin/api/perform_analysis_file.js");
const adminLoginController = require("../controllers/admin/login.js");
const documentExportHistoriesContrtoller = require("../controllers/admin/document_export_histories.js");
const authenticateToken = require('../middleware/path-to-middleware');

const multer = require('multer');
const uploadService = require("../controllers/admin/api/upload_service.js");
var path = require("path");

// Multer setup for file uploads
const upload = multer({ dest: path.join(__dirname, '../uploads/temp') });

router.get("/", adminLoginController.getAdminLogin);
router.get("/login", adminLoginController.getAdminLogin);
router.post("/login", adminLoginController.postAdminLogin);
router.get("/signup", adminLoginController.getAdminSignUp);

router.get("/document_export_histories", authenticateToken, documentExportHistoriesContrtoller.getDocumentExportHistories);

router.post("/api/v1/files/perform_analysis", performAnalysisFileController.perform);

// Upload routes
router.post("/api/upload", upload.array('images', 12), uploadService.uploadFiles); // Change to handle multiple files
router.get("/api/files", uploadService.getUploadedFiles);

module.exports = router;
