const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model.js');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Dapatkan token dari header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Dapatkan data pengguna dari ID di token, dan lampirkan ke object request
      // Kita tidak ingin mengambil password
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Lanjutkan ke controller
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Tidak terotorisasi, token gagal');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Tidak terotorisasi, tidak ada token');
  }
});

module.exports = { protect };