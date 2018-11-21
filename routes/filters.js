const express = require('express');
const router  = express.Router();
const Wine = require("../models/wine-model.js")
const Meal = require("../models/meal-model.js")

router.get('/filter-color-red', (req, res, next) => {
  // find rooms owned by the logged-in user
  Wine.find( { couleur: {$eq: "Rouge"} } )
    .then(wineResults => {
      res.locals.allWines = wineResults;
      res.render('wine-list.hbs')
    })
    .catch(err => next(err))
})

router.get('/filter-color-white', (req, res, next) => {
  // find rooms owned by the logged-in user
  Wine.find( { couleur: {$eq: "Blanc"} } )
    .then(wineResults => {
      res.locals.allWines = wineResults;
      res.render('wine-list.hbs')
    })
    .catch(err => next(err))
})

router.get('/filter-color-pink', (req, res, next) => {
  // find rooms owned by the logged-in user
  Wine.find( { couleur: {$eq: "Rose"} } )
    .then(wineResults => {
      res.locals.allWines = wineResults;
      res.render('wine-list.hbs')
    })
    .catch(err => next(err))
})

router.get('/filter-years', (req, res, next) => {
  Wine.find()
      .sort( {millesime:-1} )
      .then(wineResults => {
        res.locals.allWines = wineResults;
        res.render("wine-list.hbs")
      })
      .catch(err =>next(err))
})

router.get('/filter-name', (req, res, next) => {
  Wine.find()
      .sort( {domaine:1} )
      .then(wineResults => {
        res.locals.allWines = wineResults;
        res.render("wine-list.hbs")
      })
      .catch(err =>next(err))
})


router.post("/process-search", (req,res,next)=>{
  const {search} = req.body
  console.log(search)
  Wine.find({geographie : {$eq : search}})
  .then(data1 =>{
    if(data1.length === 0){
      
      Wine.find({appelation : {$eq : search}})
        .then(data2 =>{
            if(data2.length === 0){
          Wine.find({domaine : {$eq : search}})
          .then(data3 =>{
            if(data3.length === 0){}
            else{res.locals.allWines = data3;
              res.render('wine-list.hbs')}
          })}
          else{res.locals.allWines = data2;
            res.render('wine-list.hbs')}
        })
           .catch(err=>next(err))
       
        .catch(err=>next(err))
    }
    else{
      res.locals.allWines = data1;
      res.render('wine-list.hbs')
    }
  })
  .catch(err=>next(err))
})


module.exports = router; 
