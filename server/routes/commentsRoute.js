const express=require('express');
const router=express.Router();
const handlerFactory=require('./../controllers/handlerFactory');
const Comment = require('../model/comments');
const { deleteComment, createComment } = require('../controllers/commentController');


router.route("/")
.post(createComment)
.patch(handlerFactory.updateOne(Comment))
.get(handlerFactory.getAll(Comment))



router.route("/:id")
.delete(deleteComment)
.patch(handlerFactory.updateOne(Comment))


module.exports=router