const express = require('express');
const router  = express.Router();

const Wine = require("../models/wine-model.js")
const Meal = require("../models/meal-model.js")



router.get("/pairing", (req,res,next)=>{

  res.render("pairing/type-pairing.hbs")
})


router.get("/meat", (req,res,next)=>{
  Meal.find({type : {$eq : "Meat"}})
  .then(data =>{
    res.locals.allMeat = data
    res.render("pairing/type-meat.hbs")
  })
  .catch(err=>next(err))
})

router.get("/poultry", (req,res,next)=>{
  Meal.find({type : {$eq : "Poultry"}})
  .then(data =>{
    res.locals.allMeat = data
    res.render("pairing/type-meat.hbs")
  })
  .catch(err=>next(err))
})

router.get("/fish-and-seafood", (req,res,next)=>{
  Meal.find({type : {$eq : "Fish & Seafood"}})
  .then(data =>{
    res.locals.allMeat = data
    res.render("pairing/type-meat.hbs")
  })
  .catch(err=>next(err))
})


router.get("/cheese", (req,res,next)=>{
  Meal.find({type : {$eq : "Cheese"}})
  .then(data =>{
    res.locals.allMeat = data
    res.render("pairing/type-meat.hbs")
  })
  .catch(err=>next(err))
})

router.get("/vegetables", (req,res,next)=>{
  Meal.find({type : {$eq : "Vegetable"}})
  .then(data =>{
    res.locals.allMeat = data
    res.render("pairing/type-meat.hbs")
  })
  .catch(err=>next(err))
})

router.get("/other", (req,res,next)=>{
  Meal.find({type : {$eq : "Others"}})
  .then(data =>{
    res.locals.allMeat = data
    res.render("pairing/type-meat.hbs")
  })
  .catch(err=>next(err))
})


router.get("/:subtypeId", (req,res,next)=>{
  const subtypeId = req.params.subtypeId
  Meal.findById(subtypeId)
  .then(data =>{
    res.locals.subTypes = data
    res.render("pairing/subtypes.hbs")
  })
  .catch(err=>next(err))
})


// router.get("/poultry", (req,res,next)=>{
//   res.render("pairing/type-poultry.hbs")
// })


// router.get("/fish-and-seafood", (req,res,next)=>{
//   res.render("pairing/type-fish-and-seafood.hbs")
// })


// router.get("/cheese", (req,res,next)=>{
//   res.render("pairing/type-cheese.hbs")
// })

// router.get("/vegetables", (req,res,next)=>{
//   res.render("pairing/type-vegetables.hbs")
// })

// router.get("/other", (req,res,next)=>{
//   res.render("pairing/type-other.hbs")
// })



module.exports = router;