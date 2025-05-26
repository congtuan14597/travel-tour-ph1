"use strict"

const { User } = require("../../../models");
const employee_authentication = require("jsonwebtoken");
const collaborator_authentication = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET_KEY = process.env.SECRET_KEY;

let getUserLogin = async (req, res) => {
  res.render("user/login", { layout: false });
};

let postUserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email }});
    if (!user) {
      return res.status(404).json({
        success: false, message: "Email không tồn tại"
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false, message: "Mật khẩu không chính xác"
      })
    }

    let token;
    let cookieName;

    if (user.role === "1") {
      token = employee_authentication.sign(
        { id: user.id, email: user.email },
        SECRET_KEY
      );
      cookieName = "employeeAccessToken";
    } else {
      token = collaborator_authentication.sign(
        { id: user.id, email: user.email },
        SECRET_KEY
      );
      cookieName = "collaboratorAccessToken";
    }

    res.cookie(cookieName, token, { httpOnly: true });

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      user: {
        id: user.id,
        role: user.role,
        email: user.email
      }
    })
  } catch (error) {
    return res.status(500).json({
      success: false, message: "Lỗi khi đăng nhập"
    });
  }
};

let getUserSignUp = async (req, res) => {
  res.render("user/signup", { layout: false });
};

module.exports = {
  getUserLogin,
  postUserLogin,
  getUserSignUp
};
