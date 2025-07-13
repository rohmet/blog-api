// 1. Impor semua paket yang dibutuhkan
require('dotenv').config(); // Panggil ini di baris paling atas!
const express = require('express');
const mongoose = require('mongoose');

// 2. Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Middleware dasar
// Middleware untuk parsing body request JSON
app.use(express.json());

// === Event Listener pada koneksi mongoose ===
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose connection lost. Trying to reconnect...');
});

mongoose.connection.on('connected', () => {
  console.log('🔗 MongoDB connected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

// 4. Koneksi ke MongoDB
// Proses koneksi ini bersifat asynchronous
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('✅ Berhasil terhubung ke MongoDB Compass!');

    // 5. Jalankan server HANYA SETELAH koneksi database berhasil
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Gagal terhubung ke MongoDB:', err.message);
    process.exit(1); // Keluar dari aplikasi jika tidak bisa terhubung ke DB
  });

// Rute sederhana untuk pengujian
app.get('/', (req, res) => {
  res.send('Selamat datang di Blog API!');
});