const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/user_management_system");

const express = require("express");
const app = express();

app.use(express.static(__dirname + '/public'))

app.set("view engine","ejs")

app.use(function(req, res, next) { 
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
     next();
   });
   
//for user routes
const userRoute = require('./router/userRoute')
app.use('/', userRoute);



//for admin routes
const adminRoute = require('./router/adminRoute')
app.use('/admin', adminRoute);



app.listen(3321, function () {
    console.log("Server is running...");
});