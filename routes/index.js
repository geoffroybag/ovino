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



module.exports = router;
