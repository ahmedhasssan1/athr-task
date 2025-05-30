const express=require('express');
const router=express.Router();
const handlerFactory=require('./../controllers/handlerFactory');
const Comment = require('../model/comments');
const { deleteComment, createComment } = require('../controllers/commentController');




router.route("/")
.post(createComment)
.patch(handlerFactory.updateOne(Comment))
.get(handlerFactory.getAll(Comment))


//delete comment and must be te owner of the post oe owner of the comment

router.route("/:id")
.delete(deleteComment)
.patch(handlerFactory.updateOne(Comment))


module.exports=router