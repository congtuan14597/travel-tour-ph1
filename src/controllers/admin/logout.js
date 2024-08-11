'use strict';

let postAdminLogout = async (req, res) => {
  res.clearCookie('adminAccessToken', { path: '/' });
  res.render("admin/login");
};

module.exports = {
  postAdminLogout,
};