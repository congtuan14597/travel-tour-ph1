const user_authentication = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const { User } = require("../../models");

const userAuthenticateToken = async (req, res, next) => {
  try {
    const employeeToken = req.cookies.employeeAccessToken;
    const collaboratorToken = req.cookies.collaboratorAccessToken;

    let token;
    let role;

    if (employeeToken) {
      token = employeeToken;
      role = "1";
    } else if (collaboratorToken) {
      token = collaboratorToken;
      role = "2";
    } else {
      return res.redirect("/login");
    }

    const decoded = user_authentication.verify(token, SECRET_KEY);
    const user = await User.findByPk(decoded.id)
    if (!user || user.role !== role) {
      return res.redirect("/login");
    }

    req.user = user;
    next();
  } catch (error) {
    return res.redirect("/login");
  }
};

module.exports = userAuthenticateToken;
