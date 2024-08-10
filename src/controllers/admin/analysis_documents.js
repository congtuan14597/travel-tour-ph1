let getAnalysisDocuments = async (req, res) => {
  res.render("admin/analysis_documents/index");
};

let getFormHistoryExport = async (req, res) => {
  res.render("admin/analysis_documents/form_history_export");
};
module.exports = {
  getAnalysisDocuments,
  getFormHistoryExport
};
