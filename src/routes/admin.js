const express = require("express");
const router = express.Router();
const performAnalysisFileController = require("../controllers/admin/api/perform_analysis_file.js");
const adminLoginController = require("../controllers/admin/login.js");
const adminLogoutController = require("../controllers/admin/logout.js");
const adminAuthentication = require('../middleware/admin_authentication_middleware');
const analysisDocumentsController = require("../controllers/admin/analysis_documents.js");
const documentExportHistoriesController = require("../controllers/admin/document_export_hitories.js");
const removeBackgroudController = require("../controllers/admin/remove_backgroud.js");
const customerController = require("../controllers/admin/customers.js");
const employeeController = require("../controllers/admin/employees.js");
const collaboratorController = require("../controllers/admin/collaborators.js");

// FOR LOGIN
router.get("/", adminLoginController.getAdminLogin);
router.get("/login", adminLoginController.getAdminLogin);
router.post("/login", adminLoginController.postAdminLogin);
// FOR LOGOUT
router.post("/logout", adminLogoutController.postAdminLogout);
// FOR SIGN UP
router.get("/signup", adminLoginController.getAdminSignUp);
// FOR ANALYSIS DOCUMENTS
router.get("/analysis_documents", adminAuthentication, analysisDocumentsController.getAnalysisDocuments);
router.get("/document_export_hitories", adminAuthentication, documentExportHistoriesController.getDocumentExportHistories);
router.get("/document_export_hitories/:id", adminAuthentication, documentExportHistoriesController.downloadDocumentExportHistories);
// FOR API
router.post("/api/v1/files/perform_analysis", performAnalysisFileController.perform);
// FOR REMOVE BACKGROUND
router.get("/remove_background", adminAuthentication, removeBackgroudController.getRemoveBackgroud);
// FOR CUSTOMER
router.get("/customers", customerController.getCustomers);
router.get("/customers/new", customerController.newCustomers);
router.post("/customers/create", customerController.createCustomer);
router.get("/customers/edit/:id", customerController.editCustomer);
router.patch("/customers/:id", customerController.updateCustomer);
router.delete("/customers/:id", customerController.deleteCustomer);
// FOR EMPLOYEE
router.get("/employees", adminAuthentication, employeeController.getEmployees);
router.get("/employees/new", adminAuthentication, employeeController.newEmployees);
router.post("/employees", adminAuthentication, employeeController.createEmployee);
router.get("/employees/edit/:id", adminAuthentication, employeeController.editEmployee);
router.patch("/employees/:id", adminAuthentication, employeeController.updateEmployee);
router.delete("/employees/:id", adminAuthentication, employeeController.deleteEmployee);
router.get("/employees/task/new", adminAuthentication, employeeController.newTaskEmployees);
router.post("/employees/task", adminAuthentication, employeeController.createTaskEmployees);
// FOR COLLABORATOR
router.get("/collaborators", adminAuthentication, collaboratorController.getCollaborators);
router.get("/collaborators/new", adminAuthentication, collaboratorController.newCollaborators);
router.post("/collaborators", adminAuthentication, collaboratorController.createCollaborator);
router.get("/collaborators/edit/:id", adminAuthentication, collaboratorController.editCollaborator);
router.patch("/collaborators/:id", adminAuthentication, collaboratorController.updateCollaborator);
router.delete("/collaborators/:id", adminAuthentication, collaboratorController.deleteCollaborator);
router.get("/collaborators/customers", adminAuthentication, collaboratorController.getCollaboratorCustomers);

module.exports = router;
