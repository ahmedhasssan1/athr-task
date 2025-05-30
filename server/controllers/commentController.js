const Comment = require("../model/comments");
const Post = require("../model/posts");
const Users = require("../model/user");
const catchAsync = require("../utility/catchAsync");
const AppError = require("../utility/errorHandler");

exports.deleteComment=catchAsync(async(req,res,next)=>{
    const commentId=req.body.commentId;
    const user=req.params.id;

    console.log('debugging ',commentId);
    
    const commentExist=await Comment.findById(commentId)

    if(!commentExist){
        return res.status(404).json({message:"this eomment not exist "})
    }

    const commentOwnerrExist=await Users.findById(commentExist.user_id);
    
    const postOfCommentId=commentExist.post_id;
    const postExist=await Post.findById(postOfCommentId);

    if (!postExist || !commentOwnerrExist) {
    return next(new AppError('You are not authorized to delete this comment or post deleted', 403));
  }
//   const ownerPost=await Users.findById({id:postExist.user_id});
if (user !== commentExist.user_id.toString() && user !== postExist.user_id.toString()) {
  return res.status(403).json({
    message: "Not allowed to delete this comment"
  });
}

    
    await Comment.findByIdAndDelete(commentId);
    
    res.status(204).json({
        message:"this comment has been deleted"
    })

})


exports.createComment = catchAsync(async (req, res, next) => {
  const newComment = await Comment.create(req.body);

  await Post.findByIdAndUpdate(newComment.post_id, { $inc: { commentsCount: 1 } });

  res.status(201).json({
    status: 'success',
    data: {
      comment: newComment,
    },
  });
});


