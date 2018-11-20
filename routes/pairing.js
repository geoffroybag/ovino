const express = require('express');
const router  = express.Router();
const Wine = require("../models/wine-model.js")
const Meal = require("../models/meal-model.js")
const Order = require("../models/order-model.js")




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

router.get("/vegetable", (req,res,next)=>{
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


router.get("/subtype/:subtypeId", (req,res,next)=>{
  const subtypeId = req.params.subtypeId
  Meal.findById(subtypeId)
  .then(data =>{
    res.locals.subTypes = data
    res.render("pairing/subtypes.hbs")
  })
  .catch(err=>next(err))
})



router.get("/wine-reco/:subtypeId", (req,res,next)=>{
  const subtypeId = req.params.subtypeId
  Order.create({randomId : Math.floor(Math.random() * 10000), customerId : req.user._id })
    .then(order => {
      res.redirect(`/wine-reco/${order._id}/${subtypeId}/reco-route`)
    })
    .catch()
})

router.get("/wine-reco/:orderId/:subtypeId/reco-route", (req,res,next)=>{
  const subtypeId = req.params.subtypeId
  const orderId = req.params.orderId
  Meal.findById(subtypeId)
  .populate("wine")
  .then(data =>{
    res.locals.wineRecos = data
    return Order.findById(orderId)
      .then(order => {
        res.locals.orderInfo = order
        res.render("pairing/wine-reco.hbs")
      })
  })
  .catch(err=>next(err))
})



router.get("/add-cart/:_id/:wine", (req, res, next)=>{
  const { _id, wine } = req.params;

  Order.findByIdAndUpdate(
    _id,
    {$push: { cart: {wine} }},
    {runValidators: true},
  )
  .then(data =>{
    res.redirect(`/order-process`)
  })
  .catch(err => next(err))

})

router.get("/order-process", (req,res,next)=>{
  res.render("order-page.hbs")
})


router.get("/details/:wineId", (req,res,next)=>{
  const wineId = req.params.wineId
  Wine.findById(wineId)
  .then(data =>{
    res.locals.oneWine = data;
    res.render("product-page.hbs")
  })
  .catch(err=>next(err))
})


router.get("/order", (req,res,next)=>{
  // cart.forEach(oneItem => {
  //   Wine.findById(oneItem)
  // })
  // .then(data =>{
  //   // res.locals.oneWine = data;
  //   // res.render("order-page.hbs")
  //   res.send(data)
  // })
  res.render("order-page.hbs")

})


module.exports = router;
