const User = require('../models/user.model.js');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fungsi untuk generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token berlaku selama 30 hari
  });
};

// @desc    Register pengguna baru
// @route   POST /api/users/register
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Harap isi semua field');
  }

  // Cek jika pengguna sudah ada
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Pengguna dengan email ini sudah terdaftar');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Buat pengguna baru
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Data pengguna tidak valid');
  }
});

// @desc    Login / Autentikasi pengguna
// @route   POST /api/users/login
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Cek email pengguna
  const user = await User.findOne({ email });

  // Cek password dan jika pengguna ada
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // 401 Unauthorized
    throw new Error('Email atau password salah');
  }
});