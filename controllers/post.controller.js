const Post = require('../models/post.model.js');

// CREATE - Membuat postingan blog baru
exports.createPost = async (req, res) => {
  try {
    const { title, body, author } = req.body;
    if (!title || !body || !author) {
      return res.status(400).json({ message: "Title, body, dan author wajib diisi" });
    }
    const newPost = await Post.create({ title, body, author });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat post', error: error.message });
  }
};

// READ - Mengambil semua postingan
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data posts', error: error.message });
  }
};

// READ - Mengambil satu postingan berdasarkan ID
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post tidak ditemukan" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data post', error: error.message });
  }
};

// UPDATE - Memperbarui postingan berdasarkan ID
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post tidak ditemukan" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui post', error: error.message });
  }
};

// DELETE - Menghapus postingan berdasarkan ID
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post tidak ditemukan" });
    }
    res.status(200).json({ message: "Post berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus post', error: error.message });
  }
};