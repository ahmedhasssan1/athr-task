const mongoose = require('mongoose');
const Users = require('./user');
const Comment = require('./comments');
const Post = require('./posts');

const likeSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users,
    required: true
  },
  comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Comment,
    default: null
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Post,
    default: null
  }
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
