const express=require('express')
const messages = require('../controllers/messagesController')
const router=express.Router()


//http://localhost:5000/messages

// store messages for later retival  (bouns requirment) 


router.route('/:user1/:user2').get(messages.getChat);
module.exports=router