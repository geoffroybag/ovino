const express = require('express');
const router  = express.Router();
const fileUploader = require("../config/file-upload.js")

const Wine = require("../models/wine-model.js")
const Meal = require("../models/meal-model.js")
const User = require("../models/user-model.js")
const Order = require("../models/order-model.js")

router.get('/order', (req, res, next) => {
  req.flash("success", "Thank you ! Order completed !")
  res.redirect("/my-orders")
})

router.get('/menu', (req, res, next) => {
  res.render('menu.hbs');
})

router.get('/index', (req, res, next) => {
  res.render('index.hbs');
})


router.get('/', (req, res, next) => {
  res.render('index.hbs');

});

router.get("/wines", (req,res,next)=>{
  Wine.find()
    .then(data =>{
      res.locals.allWines = data;
      res.render("wine-list.hbs")
    })
    .catch(err=>next(err))
})

router.get("/add-fav/:meal/:wineId", (req, res, next) => {
  const { meal, wineId } = req.params;
  User.findByIdAndUpdate(
    req.user._id,
    {$push: { favorites: {wine : wineId} }},
    {runValidators: true},
  )
  .populate("favorites")
    .then(data =>{
      res.redirect(`/wine-reco/${meal}`)
    })
    .catch(err => next(err))
})

router.get("/delete-fav/:wineId", (req, res, next) => {
  const { wineId } = req.params;
  User.findByIdAndUpdate(
    req.user._id,
    {$pull: { favorites: {wine : wineId} }},
    {runValidators: true},
  )
  .populate("favorites")
    .then(data =>{
      res.redirect(`/wines-reco/${meal}`)
    })
    .catch(err => next(err))
})


router.get("/add-fav-cellar/:wineId", (req, res, next) => {
  const { wineId } = req.params;

  const isFavorited = req.user.favorites.some(oneId => {
    return oneId.wine.toString() === wineId.toString();
  });
  console.log(isFavorited)
  if(isFavorited === true){
    req.flash("error", "This wine is already in your favorites")
    res.redirect(`/cellar/details/${wineId}`)
  } else {
    User.findByIdAndUpdate(
    req.user._id,
    {$push: { favorites: {wine : wineId} }},
    {runValidators: true},
  )
  .populate("favorites")
    .then(data =>{
      res.redirect(`/cellar/details/${wineId}`)
    })
    .catch(err => next(err))
  }
})

router.get('/profile', (req, res,next)=>{
  if(req.user){
    res.render('profile-page.hbs')
  } else {
    res.render('signup-or-login.hbs')
  }
  
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
    .populate('friends.friend')
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
    const{emailadress} = req.body;

    User.findOne({email : {$eq : emailadress}})
    .then(data1 => {
      const objVersion = data1.toObject()
      objVersion.isFriend = req.user.friends.some(oneFriend => {
        return oneFriend.friend.toString() === data1._id.toString()  
    })
    if(!objVersion.isFriend){
        User.findByIdAndUpdate(
        req.user._id,
        {$push: { friends: {friend : data1._id} }},
      )
      .then(data2 =>{
        res.redirect(`/friends`)
      })
    }    
    else{
      res.redirect('/friends')
    }
})
.catch(err => next(err))
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
