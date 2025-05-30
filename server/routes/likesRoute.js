const { createLike, unlike } = require("../controllers/likescontroller");
const express = require("express");
const router = express.Router();

router.route("/")
.post(createLike)
.delete(unlike)

module.exports=router