const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport")

const User = require("../models/user-model.js")


router.get("/signup", (req, res, next)=>{
  res.render("auth-views/signup-form.hbs")
})


router.post("/process-signup", (req, res, next)=>{
  const{fullName, email, originalPassword} = req.body;
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  if(!originalPassword || originalPassword.match(/[0-9]/) === null){
    req.flash("error", "Password can't be blank and must contain a number")
    res.redirect("/signup")
    return;
  }

  User.create({fullName, email, encryptedPassword})
    .then(data => {
      req.flash("success","Sign up successful 👍🏻")
      res.redirect("/login")})
    .catch(err=>next(err))
})


router.get("/login", (req, res, next)=>{
  // send flash messages to the hbs file as "messages"
  res.render("auth-views/login-form.hbs")
})

router.post("/process-login", (req,res,next)=>{
  const{emailguess, passwordguess} = req.body;

  User.findOne({email : {$eq : emailguess}})
    .then(data => {
      if(!data){
        req.flash("error","Incorrect email")
        res.redirect("/login")
        return;
      }

      if(bcrypt.compareSync(passwordguess, data.encryptedPassword)) {

        // "req.logIn()" is a Passport method that calls "serializeUser()"
        req.logIn(data,()=>{
          req.flash("success","Log in successful 👍🏻")
          // redirect to the home page if password correct
          res.redirect("/")
        })

      }
      else {
        // "req.flash" has 2 arguments : message type and message text
        req.flash("error","Incorrect password 🛂")
        // redirect to the login page if the password is wrong
        res.redirect("/login")}
    })
    .catch(err=>next(err))

})



router.get("/logout", (req,res,next)=>{
  // logOut() will remove the user Id from the session
  req.logOut();
  req.flash("success", "Logged Out successfully 👋")
  res.redirect('/')
})





module.exports = router;
