const mongoose =require ('mongoose')
mongoose.connect ("mongodb://127.0.0.1:27017/project1");


const express =require("express");
const app =express();
const hbs=require("hbs")
const multer =require("multer");
const path=require("path");
const createError =require('http-errors')


hbs.registerPartials(__dirname + '/views/partial', );


hbs.registerHelper('ifeq', function (a, b, options) {
    if (a == b) { return options.fn(this); }
    return options.inverse(this);
});

hbs.registerHelper('ifnoteq', function (a, b, options) {
    if (a != b) { return options.fn(this); }
    return options.inverse(this);
});


//view engine setup
app.set('view engine','hbs')
app.set('views','./views')


//register partial
app.use(express.static(__dirname + '/public'));
const bodyParser= require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))


//for user routes....
const userRoute =require('./routes/userRoute')
app.use('/',userRoute)


//for admin routes
const adminRoute = require('./routes/adminRoute')
app.use('/admin', adminRoute);



app.listen(2244,function () {
    console.log("server is running...");
})



