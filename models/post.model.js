// /models/post.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definisikan "cetak biru" untuk postingan blog
const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Referensi ke ID pengguna
    required: true,
    ref: 'User', // Mereferensikan ke model 'User'
  },
  title: {
    type: String,
    required: true, // Judul wajib diisi
    trim: true      // Menghapus spasi di awal dan akhir
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // Otomatis menambahkan field createdAt dan updatedAt
});

// Buat Model berdasarkan Schema
// 'Post' akan menjadi nama koleksi di MongoDB (secara otomatis menjadi jamak: 'posts')
const Post = mongoose.model('Post', postSchema);

module.exports = Post;