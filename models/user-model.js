const mongoose = require("mongoose");

const Schema = mongoose.Schema

const userSchema = new Schema({
  fullName : {type : String, required : true, minlength : 2},
  email : {type : String, required : true, unique : true},
  encryptedPassword : {type : String,},
  role : {type : String, enum : ["normal", "admin"], default : "normal"},
  favorites : [{wine : {type : Schema.Types.ObjectId, ref: "Wine"}}],
  avatar : String,
  friends : [{friend : {type : Schema.Types.ObjectId, ref: "User"}}],
  legal : Boolean,
}, {
  timestamps : true
});


userSchema.virtual("isAdmin").get(function(){
  return this.role === "admin";
})

const User = mongoose.model("User", userSchema)

module.exports = User;

