const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/post.controller.js');
const { protect } = require('../middleware/auth.middleware.js'); // <-- Impor protect

// Rute Publik (siapa saja bisa lihat)
router.route('/').get(getAllPosts);
router.route('/:id').get(getPostById);

// Rute Terproteksi (hanya pengguna yang login bisa akses)
router.route('/').post(protect, createPost);
router.route('/:id').put(protect, updatePost).delete(protect, deletePost);

module.exports = router;