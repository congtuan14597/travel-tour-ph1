const jwt = require('jsonwebtoken');
const SECRET_KEY = 'travle123';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.redirect('/admin/login');
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.redirect('/admin/login');
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
