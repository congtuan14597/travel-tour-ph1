const express = require("express");
const router = express.Router();
const performAnalysisFileController = require("../controllers/admin/api/perform_analysis_file.js");
const adminLoginController = require("../controllers/admin/login.js");
const adminLogoutController = require("../controllers/admin/logout.js");
const adminAuthentication = require('../middleware/admin_authentication_middleware');
const analysisDocumentsContrtoller = require("../controllers/admin/analysis_documents.js");
const documentExportHistoriesController = require("../controllers/admin/document_export_hitories.js");
const removeBackgroundController = require("../controllers/admin/api/remove_bg.js");

const multer = require('multer');
const path = require('path');
// Storage image upload from feature remove background
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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
router.get("/document_export_hitories", adminAuthentication, documentExportHistoriesController.getDocumentExportHistories);
router.get("/document_export_hitories/:id", adminAuthentication, documentExportHistoriesController.downloadDocumentExportHistories);
// FOR API
router.post("/api/v1/files/perform_analysis", performAnalysisFileController.perform);
// REMOVE BACKGROUND
// router.get("/view_remove_background", adminAuthentication, removeBackgroundController.getViewRemoveBg);
// router.post("/process-image", adminAuthentication, upload.single('image_file'), removeBackgroundController.remove_background);

// FOR REMOVE BACKGROUND
router.get("/view_remove_background", adminAuthentication, removeBackgroundController.getViewRemoveBg);
router.post("/process-images", adminAuthentication, upload.array('image_files', 10), removeBackgroundController.remove_background);
module.exports = router;
