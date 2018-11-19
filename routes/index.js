const express = require('express');
const router  = express.Router();

const Wine = require("../models/wine-model.js")
const Meal = require("../models/meal-model.js")

router.get('/menu', (req, res, next) => {
  res.render('menu.hbs');
})

router.get('/index', (req, res, next) => {
  res.render('index.hbs');
})

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('loadingpage.hbs');
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


router.get("/meals", (req,res,next)=>{
  Meal.find()
    .populate("wine1")
    .populate("wine2")
    .populate("wine3")
    .then(data =>{
      res.locals.allMeals = data;
      res.render("meal-list.hbs")
    })
    .catch(err=>next(err))
})









module.exports = router;
