const jwt=require('jsonwebtoken')
const catchAsync = require('../utility/catchAsync');
const Users = require('../model/user');
const bcrypt=require('bcrypt');
require('dotenv').config()
// const { env } = require('process');


exports.login=catchAsync(async(req,res,next)=>{
    const{password,email}=req.body;
    if(!password || !email){
        res.status(400).json({message:"must be password and username toghether"})
    }
    const findUser=await Users.findOne({email:email})
    if(!findUser){
            return res.status(401).json({ message: 'Invalid username or password' });
    }
    const checkPassword=bcrypt.compare(password,findUser.password);
    if(!checkPassword){
    return res.status(401).json({ message: 'Invalid username or password' });

    }
    const token=jwt.sign({id:findUser.id,username:findUser.username},process.env.secret_api_key,{
        expiresIn:'3h'
    });
    res.status(200).json({
        status:'success',
        token: 
        {
            token
        }
    })

})

