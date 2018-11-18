const mongoose = require("mongoose");

const Schema = mongoose.Schema

const wineSchema = new Schema({
  id : {type : Number, unique : true},
  millesime : {type : Number, required : true,},
  domaine : {type : String,required : true},
  appelation : {type : String,required : true},
  geographie : {type : String,required : true},
  couleur : {type : String,required : true},
  cepage : {type : String},
  style : {type : String},
  parfum : {type : String},
  consommation : {type : Number},
  accord1 : {type : Schema.Types.ObjectId, ref: "Meal",required : true},
  accord2 : {type : Schema.Types.ObjectId, ref: "Meal",required : true},
  description : {type : String},
  prix : {type : Number},
}, {
  timestamps : true
});


const Wine = mongoose.model("Wine", wineSchema)

module.exports = Wine;

