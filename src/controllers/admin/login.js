let getAdminLogin = async (req, res) => {
  res.render("admin/login");
};

let postAdminLogin = async (req, res) => {
  res.redirect("/admin/analysis_documents");
};

let getAdminSignUp = async (req, res) => {
  res.render("admin/signup");
};


module.exports = {
  getAdminLogin,
  postAdminLogin,
  getAdminSignUp,
};
