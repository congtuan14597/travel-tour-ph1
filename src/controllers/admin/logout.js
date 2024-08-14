'use strict';

let postAdminLogout = async (req, res) => {
  res.clearCookie('adminAccessToken', { path: '/' });
  return res.status(200).json({ success: true});
};

module.exports = {
  postAdminLogout,
};
