const admin_authentication = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const token = req.cookies.adminAccessToken;

  if (!token) {
    return res.redirect('/admin/login');
  }

  admin_authentication.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.redirect('/admin/login');
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
