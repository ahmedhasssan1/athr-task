const mongoose = require('mongoose');
const Post = require('./posts');
const Comment = require('./comments');
const User = require('./user');

const likeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Post,
    default: null,
  },
  comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Comment,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Optional: Prevent both post_id and comment_id from being set together
likeSchema.pre('validate', function (next) {
  if (!this.post_id && !this.comment_id) {
    return next(new Error('Either post_id or comment_id must be provided.'));
  }
  if (this.post_id && this.comment_id) {
    return next(new Error('Only one of post_id or comment_id must be provided.'));
  }
  next();
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
