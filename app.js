require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Inisialisasi aplikasi
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// --- Impor Rute ---
const postRoutes = require('./routes/post.routes.js');

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGODB_URL) // Pastikan variabel env Anda benar
  .then(() => {
    console.log('✅ Berhasil terhubung ke MongoDB!');
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Gagal terhubung ke MongoDB:', err.message);
    process.exit(1);
  });

// Rute Dasar
app.get('/', (req, res) => {
  res.send('Selamat datang di Blog API v2 yang sudah direfactor!');
});

// --- Gunakan Rute ---
// Semua rute yang dimulai dengan /posts akan ditangani oleh postRoutes
app.use('/posts', postRoutes);

// (Event listener Mongoose bisa tetap ada jika Anda mau, atau dihapus agar lebih bersih)