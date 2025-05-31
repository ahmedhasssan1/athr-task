const Like = require('../model/likes');
const Post = require('../model/posts');
const Comment = require('../model/comments');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/errorHandler');


function validateLikeREquest(postID,commentID){
  if(!postID && !commentID){
    return {valid:false,message:"you either like posta or comment"}
  }
  if( postID && commentID){
    return {valid:false,message:"you either like posta or comment"}
  }
  return {valid:true}

}



exports.createLike = catchAsync(async (req, res, next) => {
  const { user_id, post_id, comment_id } = req.body;

  const validation=validateLikeREquest(post_id,comment_id);
  if(!validation.valid){
    return next(new AppError('you either like  comment or post '))
  }

let filter = { user_id };

if (comment_id) {
  filter.comment_id = comment_id;
} else if (post_id) {
  filter.post_id = post_id;
}

const existingLike = await Like.findOne(filter);

if (existingLike) {
  return res.status(401).json({
    message: `You have already liked this ${comment_id ? 'comment' : 'post'}`,
  });
}
  const like = await Like.create({
    user_id: req.body.user_id,
    post_id: post_id || null,
    comment_id: comment_id || null,
  });

  if (post_id) {
    await Post.findByIdAndUpdate(post_id, { $inc: { likesCount: 1 } });
  } else if (comment_id) {
    await Comment.findByIdAndUpdate(comment_id, { $inc: { likesCount: 1 } });
  }

  res.status(201).json({
    status: 'success',
    data: like,
  });
});

exports.unlike = catchAsync(async (req, res, next) => {
  const { comment_id, post_id, user_id } = req.body;

 const validation=validateLikeREquest(post_id,comment_id);
  if(!validation.valid){
    return next(new AppError('you must provide what  like you want to  remove'))
  }

  const filter = { user_id };

  if (post_id) {
    filter.post_id = post_id;
  } else {
    filter.comment_id = comment_id;
  }

  const existingLike = await Like.findOne(filter);

  if (!existingLike) {
    return next(new AppError('you are not like  this to remove the like'))
  }

  await existingLike.deleteOne();

  if (post_id) {
    const post=await Post.findById(post_id);
     if ( post&& post.likesCount > 0) {
      await Post.findByIdAndUpdate(post_id, { $inc: { likesCount: -1 } });
    }
  } else if (comment_id) {
    const comment=await Comment.findById(comment_id);
    if( comment && comment.likesCount>0){
    await Comment.findByIdAndUpdate(comment_id, { $inc: { likesCount: -1 } });
    }
  }

  return res.status(200).json({
    message: 'The like has been removed successfully.',
  });
});

