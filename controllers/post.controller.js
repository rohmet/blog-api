const Post = require('../models/post.model.js');
const asyncHandler = require('express-async-handler');

// CREATE - Membuat postingan blog baru
exports.createPost = asyncHandler (async (req, res) => {
  const { title, body, author } = req.body;
  if (!title || !body) {
    res.status(400);
    throw new Error('Title, body, dan author wajib diisi');
  }
  const newPost = await Post.create({ title, body, author, user: req.user.id, });
  res.status(201).json(newPost);
});

// READ - Mengambil semua postingan
exports.getAllPosts = asyncHandler (async (req, res) => {
  // 1. Ambil parameter query, berikan nilai default
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // 2. Hitung total dokumen untuk metadata
  const totalPosts = await Post.countDocuments();
  
  // 3. Modifikasi query dengan skip dan limit
  const posts = await Post.find({})
  .populate('user', 'nama email')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
  res.status(200).json({
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
    totalPosts,
    posts,
  });
});

// READ - Mengambil satu postingan berdasarkan ID
exports.getPostById = (async (req, res) => {
  const post = await Post.findById(req.params.id).populate('user', 'name email');
  if (!post) {
    res.status(404);
    throw new Error('Post tidak ditemukan');
  }
  res.status(200).json(post);
});

// UPDATE - Dibungkus dengan asyncHandler dan tanpa try...catch
exports.updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post tidak ditemukan');
  }

  if (post.user.toString() !== req.user.id) {
    res.status(401); // Unauthorized
    throw new Error('Aksi tidak diizinkan');
  }
  
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedPost);
});

// DELETE - Dibungkus dengan asyncHandler dan tanpa try...catch
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post tidak ditemukan');
  }

  if (post.user.toString() !== req.user.id) {
    res.status(401); // Unauthorized
    throw new Error('Aksi tidak diizinkan');
  }

  await post.deleteOne(); // atau Post.findByIdAndDelete(req.params.id)
  res.status(200).json({ message: 'Post berhasil dihapus', id: req.params.id });
});