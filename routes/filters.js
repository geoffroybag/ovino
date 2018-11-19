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

module.exports = router;