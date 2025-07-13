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

// === ROUTES UNTUK POSTS ===.
app.post('/posts', async (req, res) => {
  try {
    // Ambil data (title, body, author) dari request body
    // Kita bisa melakukan ini karena middleware express.json()
    const { title, body, author } = req.body;

    // Validasi input: Cek jika salah satu field kosong
    if (!title || !body || !author) {
      return res.status(400).json({ message: "Title, body, dan author wajib diisi" });
    }

    const newPost = await Post.create({
      title: title,
      body: body,
      author: author
    });
    // Kirim kembali response sukses (201 Created) bersama data yang baru dibuat
    res.status(201).json(newPost);
  
  } catch (error) {
    // Jika terjadi error (misalnya validasi gagal), kirim response error
    res.status(400).json({ message: 'Gagal membuat post', error: error.message });
  }
});

// READ - Mengambil semua postingan
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data posts', error: error.message });
  }
});

// READ - Mengambil satu postingan berdasarkan ID
app.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    // Jika post dengan ID tersebut tidak ditemukan
    if (!post) {
      return res.status(404).json({ message: "Post tidak ditemukan" });
    }

    // Jika post ditemukan
    res.status(200).json(post);
  } catch (error) {
    // Error bisa terjadi jika format ID tidak valid
    res.status(500).json({ message: 'Gagal mengambil data post', error: error.message });
  }
});

// UPDATE - Memperbarui postingan berdasarkan ID
app.put('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params; // Dapatkan ID dari URL
    const updateData = req.body; // Dapatkan data baru dari body request

    if (Object.keys(updateData).length === 0){
      res.status(400).send("Tidak ada data yang dikirim untuk diperbarui.")
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
      new: true, // Mengembalikan dokumen yang SUDAH diperbarui
      runValidators: true // Menjalankan validasi schema (misal: 'required') pada update
    });

    // Jika post dengan ID tersebut tidak ditemukan
    if (!updatedPost) {
      return res.status(404).json({ message: "Post tidak ditemukan" });
    }

    // Jika berhasil, kirim kembali post yang sudah diupdate
    res.status(200).json(updatedPost);

  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui post', error: error.message });
  }
});