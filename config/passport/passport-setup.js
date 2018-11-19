const passport = require("passport")

const User = require("../../models/user-model.js");


passport.serializeUser((userDoc, done)=>{
  console.log("SERIALIZE 🍐")
  done(null, userDoc._id)
});


passport.deserializeUser((userId,done)=>{
  console.log("DESERIALIZE 🍋")
  User.findById(userId)
    .then(userDoc =>{
      done(null,userDoc)
    })
    .catch(err=>done(err))
});

