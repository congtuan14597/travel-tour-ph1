"use strict"

let postUserLogout = async (req, res) => {
  res.clearCookie("employeeAccessToken", { path: "/" });
  res.clearCookie("collaboratorAccessToken", { path: "/" });

  return res.status(200).json({ success: true });
};

module.exports = {
  postUserLogout
};
