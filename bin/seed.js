const mongoose = require("mongoose");

const Meal = require ('../models/meal-model.js')
const Wine = require("../models/wine-model.js")

mongoose
  .connect('mongodb://localhost/awesome-project', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


// const mealData =
// 	{"type":"Meat","subtype":"Lamb","dish":["Lamb", "Lamb chop", "Rack ok lamb","Leg of lamb","Navarin of lamb","Shoulder of Lamb"],"winepairing":[{"$oid":"5bf0214b6f95a57fe1464b47"},{"$oid":"5bf0214b6f95a57fe1464b48"},{"$oid":"5bf0214b6f95a57fe1464b49"}]}




// Meal.create(mealData)
// 	.then(bookDoc => {
// 		console.log(`Created dish ${bookDoc.subtype}`)
// 	})
// 	.catch(err=> {console.log("Book creation FAILED", err)});




