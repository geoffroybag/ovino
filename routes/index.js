const express = require('express');
const router  = express.Router();

const Wine = require("../models/wine-model.js")
const Meal = require("../models/meal-model.js")
const User = require("../models/user-model.js")

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



module.exports = router;
