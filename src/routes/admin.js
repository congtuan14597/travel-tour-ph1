const express = require("express");
const router = express.Router();
const performAnalysisFileController = require("../controllers/admin/api/perform_analysis_file.js");
const adminLoginController = require("../controllers/admin/login.js");
const documentExportHistoriesContrtoller = require("../controllers/admin/document_export_histories.js");

router.get("/", adminLoginController.getAdminLogin);
router.get("/login", adminLoginController.getAdminLogin);
router.post("/login", adminLoginController.postAdminLogin);

router.get("/document_export_histories", documentExportHistoriesContrtoller.getDocumentExportHistories);

router.post("/api/v1/files/perform_analysis", performAnalysisFileController.perform);

module.exports = router;
