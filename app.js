// 1. Impor semua paket yang dibutuhkan
require('dotenv').config(); // Panggil ini di baris paling atas!
const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/post.model.js');

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

app.post('/posts', async (req, res) => {
  try {
    // Ambil data (title, body, author) dari request body
    // Kita bisa melakukan ini karena middleware express.json()
    const { title, body, author } = req.body;

    if (title, body, author){
      res.status(400).send("Title, body, dan author wajib diisi")      
    } else {
      // Buat postingan baru menggunakan model Post
      const newPost = await Post.create({
        title: title,
        body: body,
        author: author
      });
      // Kirim kembali response sukses (201 Created) bersama data yang baru dibuat
      res.status(201).json(newPost);
    }
  } catch (error) {
    // Jika terjadi error (misalnya validasi gagal), kirim response error
    res.status(400).json({ message: 'Gagal membuat post', error: error.message });
  }
});