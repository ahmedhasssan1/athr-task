const mongoose = require('mongoose');
const Users = require('./user');

const postSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users,
    required: true
  },
  caption: {
    type: String,
    maxlength: 250
  },
  likesCount:{
    type:Number
  },
  commentsCount:{
    type:Number
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
