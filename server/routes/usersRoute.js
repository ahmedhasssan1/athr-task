const express=require('express');
const router=express.Router();
const handlerFactory=require('./../controllers/handlerFactory');
const Users = require('../model/user');
const authController= require('../controllers/authController');



router
    .route('/')
    .post(handlerFactory.createOne(Users))
    .get()

router.route('/auth').post(authController.login)

module.exports = router;
