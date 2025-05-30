const express=require('express');
const router=express.Router();
const handlerFactory=require('./../controllers/handlerFactory');
const Post = require('../model/posts');


router.route('/')
.post(handlerFactory.createOne(Post))
.get(handlerFactory.getAll(Post))



router.route("/:id")
.patch(handlerFactory.updateOne(Post))
.delete(handlerFactory.deleteone(Post))
.get(handlerFactory.getDocumentById(Post))


module.exports=router;