const express=require('express')
const { getchat } = require('../controllers/messagesController')
const router=express.Router()


router.route('/:user1/:user2').get(getchat);
module.exports=router