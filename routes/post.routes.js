const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller.js');

// Rute untuk mendapatkan semua post & membuat post baru
router.route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost);

// Rute untuk mendapatkan, memperbarui, & menghapus post tunggal
router.route('/:id')
  .get(postController.getPostById)
  .put(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;