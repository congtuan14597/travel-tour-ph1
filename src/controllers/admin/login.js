let getAdminLogin = async (req, res) => {
  res.render("admin/login");
};

let postAdminLogin = async (req, res) => {
  res.redirect("/admin/document_export_histories");
};

module.exports = {
  getAdminLogin,
  postAdminLogin,
};
