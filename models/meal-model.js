const mongoose = require("mongoose");

const Schema = mongoose.Schema

const mealSchema = new Schema({
  type : {type : String,required : true},
  subtype : {type : String,required : true},
  dish : [{type : String,required : true}],
  wine : [{type : Schema.Types.ObjectId, ref: "Wine"}],
}, {
  timestamps : true
});


const Meal = mongoose.model("Meal", mealSchema)

module.exports = Meal;
