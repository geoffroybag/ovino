const express = require('express');
const router  = express.Router();
const Wine = require("../models/wine-model.js")
const Meal = require("../models/meal-model.js")
const Order = require("../models/order-model.js")
const User = require("../models/user-model.js")




router.get("/start", (req,res,next)=>{
  if(req.user){
    res.render("pairing/type-pairing.hbs")
  }
  else{
    res.render("signup-or-login-pairing.hbs")
  }
  
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
    res.locals.wineRecos = data;
    
      return Order.findById(orderId)
      .then(order => {
        res.locals.orderInfo = order
        
        const wineObjects = data.wine.map(oneWine => {
          const objVersion = oneWine.toObject();
          objVersion.isAdded = order.cart.some(id => {
            return id.toString() === oneWine._id.toString();
          });
          objVersion.isFavorite = req.user.favorites.some(fave => {
            return fave.wine.toString() === oneWine._id.toString();
          });

          return objVersion;
        });
        res.locals.subTypeId = subtypeId
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
    // res.send(data)
    res.locals.orderInfo = data
    if(data.cart.length === 0){
      req.flash("error", "Please, select a wine before buy it.")
      res.redirect(`/wine-reco/${_id}/${subtypeId}/reco-route`)
    }
    else {
      let total = 0;

      for (let i=0; i<data.cart.length; i++){
        total += data.cart[i].prix*10;
        
      }

      res.locals.productTotal = total;
      res.locals.grandTotal = total + 5;
      res.render("order-page.hbs")
    }
    res.render("order-page.hbs")
    // res.send(data)
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
    if(req.user){
      const objVersion = data.toObject()
        objVersion.isFavorite = req.user.favorites.some(fave => {
          return fave.wine.toString() === data._id.toString();
        });

      res.locals.oneWine = objVersion;
    res.render("wine-page.hbs")
  }
    else{
      res.locals.oneWine = data;
      res.render("wine-page.hbs")
    }
  })
  .catch(err=>next(err))
})




router.get("/delete/:_id/:subtypeId/:wine", (req,res,next)=>{
  const { _id, subtypeId, wine } = req.params;
  Order.findByIdAndUpdate(
    _id,
    {$pull: {cart :  wine}},
    {runValidators: true}
  )
  .then(data =>{
    res.redirect(`/wine-reco/${_id}/${subtypeId}/reco-route`)
  })
  .catch(err => next(err))
})


router.get("/delete-one/:_id/:wineId/:subtypeId", (req,res,next)=>{
  const { _id , wineId, subtypeId} = req.params;
  Order.findByIdAndUpdate(
    _id,
    {$pull: {cart :  wineId}},
    {runValidators: true}
  )
  .then(data =>{
    if(data.cart.length === 1){
      res.redirect(`/wine-reco/${_id}/${subtypeId}/reco-route`)
    }
    else {
      res.redirect(`/order-process/${_id}/${subtypeId}`)
    }
  })
  .catch(err => next(err))
})

router.get("/fav/:_id/", (req,res,next)=>{
  const { _id } = req.params
  Wine.findById(_id)
  .then(data =>{
    
      const objVersion = data.toObject()
        objVersion.isFavorite = req.user.favorites.some(fave => {
          return fave.wine.toString() === data._id.toString();
        });
        
      res.locals.oneWine = objVersion;

    res.render("wine-page.hbs")
  })
  .catch(err=>next(err))
})




router.get("/add-fav-pairing/:wineId/:orderId/:mealId", (req, res, next) => {
  const { wineId, orderId,mealId  } = req.params;

  const isFavorited = req.user.favorites.some(oneId => {
    return oneId.wine.toString() === wineId.toString();
  });
    User.findByIdAndUpdate(
    req.user._id,
    {$push: { favorites: {wine : wineId} }},
    {runValidators: true},
  )
  .populate("favorites")
    .then(data =>{
      res.redirect(`/wine-reco/${orderId}/${mealId}/reco-route`)
    })
    .catch(err => next(err))
})

router.get('/profile', (req, res,next)=>{
  res.render('profile-page.hbs')
})



module.exports = router;
