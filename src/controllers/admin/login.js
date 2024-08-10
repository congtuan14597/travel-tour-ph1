'use strict';

const { Admin } = require('../../../models');
const admin_authentication = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.SECRET_KEY;

let getAdminLogin = async (req, res) => {
  res.render("admin/login");
};

let postAdminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Email không tồn tại' });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Mật khẩu không chính xác' });
    }

    const token = admin_authentication.sign(
      { id: admin.id, email: admin.email },
      SECRET_KEY
    );

    // res.cookie('accessToken', token, { httpOnly: true });
    return res.status(200).json({ success: true, message: 'Đăng nhập thành công', token });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi đăng nhập' });
  }
  // res.redirect("/");
};

let getAdminSignUp = async (req, res) => {
  res.render("admin/signup");
};

module.exports = {
  getAdminLogin,
  postAdminLogin,
  getAdminSignUp,
};
