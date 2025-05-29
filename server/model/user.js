const mongoose=require('mongoose');
const bcrypt=require('bcrypt');


const userSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    maxlength: 50,
    required: true
  },
  bio: {
    type: String,
    maxlength: 400
  },
  avatar: {
    type: String,
    maxlength: 200
  },
  number: {
    type: String,
    maxlength: 25
  },
  email: {
    type: String,
    maxlength: 200,
    unique: true,
    required: true
  },
  password: {
    type: String,
    maxlength: 200,
    required: true
  },
  status: {
    type: String,
    maxlength: 100
  }

})

userSchema.pre('save',async function(next){
  this.password=await bcrypt.hash(this.password,12)
  // console.log(this.password)
  next()
})


const Users=new mongoose.model('users',userSchema);
module.exports=Users
