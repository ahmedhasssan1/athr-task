const { createLike, unlike } = require("../controllers/likescontroller");
const express = require("express");
const router = express.Router();


//http://localhost:5000/likes

//like and unlike routes



router.route("/")
.post(createLike)
.delete(unlike)

module.exports=router