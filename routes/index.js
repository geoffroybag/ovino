const express = require('express');
const router  = express.Router();

const Wine = require("../models/wine-model.js")
const Meal = require("../models/meal-model.js")
const User = require("../models/user-model.js")

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






module.exports = router;
