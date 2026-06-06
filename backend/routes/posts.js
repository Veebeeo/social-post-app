const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// @route   POST /api/posts
// @desc    Create a post (text, image, or both)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!text && !imageUrl) {
      return res.status(400).json({ message: 'Post must contain either text or an image' });
    }

    const newPost = new Post({
      user: req.user.userId,
      username: req.user.username,
      text: text || '',
      imageUrl: imageUrl
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts
// @desc    Get all posts for the public feed
router.get('/', async (req, res) => {
  try {
    // Sort by newest first
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like or unlike a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const username = req.user.username;
    const index = post.likes.indexOf(username);

    if (index === -1) {
      // User hasn't liked it yet, so add like
      post.likes.push(username);
    } else {
      // User already liked it, so unlike (remove)
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      username: req.user.username,
      text: text
    };

    post.comments.push(newComment);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/posts/:id
// @desc    Edit a post's text
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Ensure the logged-in user is the creator of the post
    if (post.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized to edit this post' });
    }

    // Update the text and save
    post.text = req.body.text || '';
    await post.save();
    
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Ensure the logged-in user is the creator of the post
    if (post.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

