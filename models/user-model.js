const mongoose = require("mongoose");

const Schema = mongoose.Schema

const userSchema = new Schema({
  fullName : {type : String, required : true, minlength : 2},
  email : {type : String, required : true, unique : true},
  encryptedPassword : {type : String,},
  role : {type : String, enum : ["normal", "admin"], required : true, default : "normal"},
  favorites : [{type : Schema.Types.ObjectId, ref: "Wine"}],
}, {
  timestamps : true
});


userSchema.virtual("isAdmin").get(function(){
  return this.role === "admin";
})

const User = mongoose.model("User", userSchema)

module.exports = User;

