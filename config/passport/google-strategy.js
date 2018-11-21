const passport = require("passport")

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../../models/user-model.js")

passport.use(new GoogleStrategy({
  // settings object for the GoogleStrategy class
  clientID : process.env.GOOGLE_CLIENT_ID,
  clientSecret : process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/google/user-info',
  proxy: true,
},(accessToken, refreshToken, userInfo, done)=>{
  // callback function that runs whenever a user accepts the Google login
  // (decide how to save the information)
  console.log("GOOGLE user info---------------------------------------", userInfo);
  const{displayName, emails} = userInfo;

  // search the DB is the user already has an account
  User.findOne({email:  {$eq : emails[0].value}})
    .then(data =>{
      if(data){
        // use the existing account if we found one
        done(null, data);
        return;
      } 
      User.create({fullName : displayName, email: emails[0].value})
        .then(data =>{
          done(null, data)
        })
        .catch(err=>done(err))
    })
    .catch(err=>done(err))
}))