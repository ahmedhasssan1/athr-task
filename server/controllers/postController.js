const Post = require("../model/posts");
const Users = require("../model/user");
const catchAsync = require("../utility/catchAsync");

exports.usersPosts=catchAsync(async(req,res,next)=>{
    const user=await Users.findById(req.params.id);
    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }
    const findpostAttachedToUser=await Post.find({user_id:user.id});
    if(!findpostAttachedToUser){
        return res.status(404).json({
            messgae:"no posts atttached to this user"
        })

    }
    res.status(200).json({
        status:"sucess",
        posts:{
            findpostAttachedToUser
        }
    })

})