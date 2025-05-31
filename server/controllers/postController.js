const Post = require("../model/posts");
const Users = require("../model/user");
const catchAsync = require("../utility/catchAsync");
const AppError = require("../utility/errorHandler");

exports.usersPosts=catchAsync(async(req,res,next)=>{
    const user=await Users.findById(req.params.id);
    if(!user){
        return next(new AppError('user not exist'))
    }
    const findpostAttachedToUser=await Post.find({user_id:user.id});
    if(!findpostAttachedToUser){
        return next(new AppError('no posts attached to this user'))

    }
    res.status(200).json({
        status:"sucess",
        posts:{
            findpostAttachedToUser
        }
    })

})