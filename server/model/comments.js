const mongoose = require('mongoose');
const Users = require('./user');
const Post = require('./posts');

const commentSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users,
    required: true
  },
  content: {
    type: String,
    maxlength: 200,
    required: true
  },
  likesCount:{
    type:Number,
    default:0
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Post,
    required: true
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
