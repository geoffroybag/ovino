const mongoose = require("mongoose");
const User = require("../models/user-model.js")

mongoose
  .connect('mongodb://localhost/awesome-project', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });



  User.create({fullName : "JMichel", email : "jmich@mich.com"})
    .then(bookDoc => {
      console.log(`Created user ${bookDoc.fullName}`)
    })
    .catch(err=> {console.log("user creation FAILED", err)});