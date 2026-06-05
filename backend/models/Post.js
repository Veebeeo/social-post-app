//Comments are stored as an array of subdocuments
//and likes are handled as an array of user tracking strings.

const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Save the username of commenter
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true }, // Cached for easy feed display
  text: { type: String }, // Optional if image is present
  imageUrl: { type: String }, // Optional if text is present
  likes: [{ type: String }], // Array of usernames who liked the post
  comments: [CommentSchema], // Embedded array of comment subdocuments
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);