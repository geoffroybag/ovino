const express = require('express');
const router  = express.Router();
const fileUploader = require("../config/file-upload.js")

const Wine = require("../models/wine-model.js")
const Meal = require("../models/meal-model.js")
const User = require("../models/user-model.js")
const Order = require("../models/order-model.js")

router.get('/menu', (req, res, next) => {
  res.render('menu.hbs');
})

router.get('/index', (req, res, next) => {
  res.render('index.hbs');
})

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index.hbs');
  // setTimeout(function(){ 
  //   res.render('index.hbs');
  //  }, 2000);
});

router.get("/wines", (req,res,next)=>{
  Wine.find()
    .then(data =>{
      res.locals.allWines = data;
      res.render("wine-list.hbs")
    })
    .catch(err=>next(err))
})

router.get("/add-fav/:meal/:wine", (req, res, next) => {
  const { meal, wine } = req.params;
  User.findByIdAndUpdate(
    req.user._id,
    {$push: { favorites: {wine} }},
    {runValidators: true},
  )
  .populate("favorites")
    .then(data =>{
      res.redirect(`/wine-reco/${meal}`)
    })
    .catch(err => next(err))
})


router.get("/add-fav-cellar/:wine", (req, res, next) => {
  const { wine } = req.params;
  User.findByIdAndUpdate(
    req.user._id,
    {$push: { favorites: {wine} }},
    {runValidators: true},
  )
  .populate("favorites")
    .then(data =>{
      res.redirect(`/cellar/details/${wine}`)
    })
    .catch(err => next(err))
})



router.get('/profile', (req, res,next)=>{
  res.render('profile-page.hbs')
})


router.get("/settings", (req,res,next)=>{
  if(!req.user){
    req.flash("error", "Please log in before visiting the settings page")
    res.redirect("/login")
  }
  else {
    res.render("settings-page.hbs")
  }
  
})

router.post('/process-settings', fileUploader.single("avatarUpload") ,(req,res, next)=>{
  const {fullName, email} = req.body;

  let toUpdate = {fullName, email}

  if(req.file){
    toUpdate = {fullName, email, avatar : req.file.secure_url}
  }

  User.findByIdAndUpdate(
    req.user._id,
    {$set: toUpdate},
    {runValidators : true} //check the rules
  )
  .then(data =>{
    req.flash("success", "Settings saved!")
    res.redirect("/settings")
  })
    .catch(err => next(err))
})


router.get("/my-orders", (req,res,next)=>{
  Order.find({customerId : {$eq : req.user._id}})
    .populate("cart")
    .sort({createdAt : -1})
    .limit(5)
    .then(data=>{
      res.locals.orderInfo = data;
      res.render("my-orders.hbs")
    })
})

router.get("/friends", (req,res,next)=>{
  User.findById(req.user._id)
    .populate("friends")
    .populate({
      path: 'friends',
      populate: { path: 'favorites.wine' }
    })
    .then(data=>{
      res.locals.userFriends = data.friends;
      res.render("friends.hbs")
      // res.send(data)
    })
})

router.post("/add-friend", (req,res,next)=>{
    const{email} = req.body;

    User.findOne({email : {$eq : email}})
    .then(oneFriend =>
        User.findByIdAndUpdate(
        req.user._id,
        {$push: { friends: oneFriend._id }},
      )
      .then(data =>{
        res.redirect(`/friends`)
      })
    .catch(err => next(err)))
    
})

router.get("/favorites", (req,res,next)=>{
  User.findById(req.user._id)
    .populate("favorites.wine")
    .then(data=>{
      res.locals.userFavorites = data.favorites;
      res.render("favorites.hbs")
    })
})


router.get("/autocomplete", (req,res,next)=>{
      res.render("autocomplete.hbs")

})


module.exports = router;
