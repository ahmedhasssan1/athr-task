const express=require('express');
const router=express.Router();
const handlerFactory=require('./../controllers/handlerFactory');
const Post = require('../model/posts');
const { usersPosts } = require('../controllers/postController');


//get all posts sith option to apply pagenition

router.route('/')
.post(handlerFactory.createOne(Post))
.get(handlerFactory.getAll(Post))



router.route("/:id")
.patch(handlerFactory.updateOne(Post))
.delete(handlerFactory.deleteone(Post))
.get(handlerFactory.getDocumentById(Post))

router.route("/usersPost/:id").get(usersPosts)


module.exports=router;