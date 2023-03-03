const express = require("express");
const user_route = express();
const session = require("express-session");
const config =require("../config/config");
user_route.use(session({secret:config.sessionSecret}));

const auth = require("../middleware/auth");
user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');


const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }))




// const multer = require ("multer")
// const path = require("path")

// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,path.join(__dirname,'.../public/userImages'));
//     },
//     filename:function(req,file,cb){
//         const name =Date.now()+'-'+file.originalname;
//         cb(null,name);

//     }

// })

// const upload = multer({storage:storage});



const userController = require("../controller/userController");

user_route.get('/register',auth.isLogout, userController.LoadRegister);

user_route.post('/register', userController.insertUser);

// user_route.get('/verify', userController.verifyMail);

user_route.get('/',function(req,res){
    if(req.session.user_id){
        res.redirect("/home")
    }else{
        res.redirect("/login")
    }
}
);

user_route.get('/login',userController.loginload);

user_route.post('/login',userController.verifyLogin);


user_route.get('/home',auth.isLogin,userController.loadHome);

user_route.get('/logout',auth.isLogin,userController.userlogout);


 
module.exports = user_route;
