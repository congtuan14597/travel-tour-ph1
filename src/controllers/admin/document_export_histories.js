let getDocumentExportHistories = async (req, res) => {
  res.render("admin/document_export_histories/index");
};

module.exports = {
  getDocumentExportHistories
};
