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
    // res.send(data.wine)
    res.locals.wineRecos = data;
    
    // return User.findById(req.user._id)
    //   .then(data => {
      //     const { favorites } = data;
      
      //     res.render("pairing/wine-reco.hbs")
      //   })
      return Order.findById(orderId)
      .then(order => {
        res.locals.orderInfo = order
        
        const wineObjects = data.wine.map(oneWine => {
          const objVersion = oneWine.toObject();
          objVersion.isAdded = order.cart.some(id => {
            return id.toString() === oneWine._id.toString();
          });

          return objVersion;
        });

        res.locals.wineArray = wineObjects;
        res.render("pairing/wine-reco.hbs")
      })
  })
  .catch(err=>next(err))
})



router.get("/add-cart/:_id/:subtypeId/:wine", (req, res, next)=>{
  const { _id, subtypeId, wine } = req.params;

  Order.findByIdAndUpdate(
    _id,
    {$push: { cart: wine }},
    {runValidators: true},
  )
  .then(data =>{
    res.redirect(`/wine-reco/${_id}/${subtypeId}/reco-route`)
  })
  .catch(err => next(err))

})

router.get("/order-process/:_id/:subtypeId", (req,res,next)=>{
  const { _id, subtypeId } = req.params;
   res.locals.mealId = subtypeId
    res.locals.orderId = _id
  Order.findById(_id)
  .populate("cart")
  .then(data =>{
    res.locals.orderInfo = data.cart
 
    res.render("order-page.hbs")
  })
  .catch(err => next(err))
})


router.get("/details/:_id/:subtypeId/:wineId", (req,res,next)=>{
  const { _id, subtypeId, wineId } = req.params
  res.locals.mealId = subtypeId
    res.locals.orderId = _id
  Wine.findById(wineId)
  .then(data =>{
    res.locals.oneWine = data;
    res.render("product-page.hbs")
  })
  .catch(err=>next(err))
})


router.get("/cellar/details/:_id/", (req,res,next)=>{
  const { _id } = req.params
  Wine.findById(_id)
  .then(data =>{
    res.locals.oneWine = data;
    res.render("wine-page.hbs")
  })
  .catch(err=>next(err))
})


module.exports = router;
