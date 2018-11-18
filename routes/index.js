const express = require('express');
const router  = express.Router();

const Wine = require("../models/wine-model.js")
const Meal = require("../models/meal-model.js")

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/menu', (req, res, next) => {
  res.render('menu.hbs');
})

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
