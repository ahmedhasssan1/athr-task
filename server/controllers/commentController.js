const Comment = require('../model/comments');
const Post = require('../model/posts');
const Users = require('../model/user');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/errorHandler');

exports.deleteComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.body;
  const userId = req.params.id;

  if (!commentId) {
    return next(new AppError("Comment ID is required", 400));
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new AppError("Comment does not exist", 404));
  }

  const commentOwner = await Users.findById(comment.user_id);
  const post = await Post.findById(comment.post_id);

  if (!post || !commentOwner) {
    return next(new AppError("Either the post or the user was deleted", 403));
  }

  const isCommentOwner = userId === comment.user_id.toString();
  const isPostOwner = userId === post.user_id.toString();

  if (!isCommentOwner && !isPostOwner) {
    return next(new AppError("You are not authorized to delete this comment", 403));
  }

  await Comment.findByIdAndDelete(commentId);
  await Post.findByIdAndUpdate(post._id, { $inc: { commentsCount: -1 } });

   res.status(200).json({
    status: "success",
    message: "Comment has been deleted",
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const { post_id, user_id, content } = req.body;

  if (!post_id || !user_id || !content) {
    return next(new AppError("Post ID, user ID, and content are required", 400));
  }

  const comment = await Comment.create({ post_id, user_id, content });

  await Post.findByIdAndUpdate(post_id, { $inc: { commentsCount: 1 } });

  res.status(201).json({
    status: "success",
    data: {
      comment,
    },
  });
});
