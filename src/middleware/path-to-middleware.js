const admin_authentication = require('jsonwebtoken');
const SECRET_KEY = 'travle123';

const authenticateToken = (req, res, next) => {
  // Lấy token từ header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer token"

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