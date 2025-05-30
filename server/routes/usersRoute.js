const express=require('express');
const router=express.Router();
const handlerFactory=require('./../controllers/handlerFactory');
const Users = require('../model/user');
const authController= require('../controllers/authController');


//http://localhost:5000/users



// protect all user route to check if they have a valid token 

router
    .route('/')
    .post(handlerFactory.createOne(Users))
    .get(handlerFactory.getAllUsers(Users))

router.route('/getAllUsers').get(authController.validateToken,handlerFactory.getAll(Users))
router.route('/getCurrentUser').post(authController.getCurrentUser)

//router with id as params
router.route('/:id')
.patch(authController.validateToken,handlerFactory.updateOne(Users))
.delete(authController.validateToken,handlerFactory.softDelete(Users))
.get(authController.validateToken,handlerFactory.getDocumentById(Users))

router.route('/auth').post(authController.login)


module.exports = router;
