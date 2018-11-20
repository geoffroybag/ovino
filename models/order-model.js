const mongoose = require("mongoose");

const Schema = mongoose.Schema

const orderSchema = new Schema({
  cart : [{wine : {type : Schema.Types.ObjectId, ref: "Wine"}}],
  randomId : {type : Number},
  quantity : {type : Number},
  totalPrice : {type : Number},
  email : {type : String,},
  dateOrdered : {type : Date},
  shippingAddress : {type : String,},
  customerId : {type : Schema.Types.ObjectId, ref: "User"},
  isCart : {type : Boolean},
  isPaid : {type : Boolean}
}, {
  timestamps : true
});


const Order = mongoose.model("Order", orderSchema)

module.exports = Order;

