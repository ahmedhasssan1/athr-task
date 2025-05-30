const express=require('express')
const messages = require('../controllers/messagesController')
const router=express.Router()


router.route('/:user1/:user2').get(messages.getChat);
module.exports=router