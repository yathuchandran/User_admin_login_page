const express = require ("express") 
const user_route = express();

const session = require("express-session")
const config =require("../config/config")
user_route.use(session({secret:config.sessionSecret}))


const auth =require("../middleware/auth")

const userController = require ("../controllers/userController");



user_route.get('/register',auth.isLogout,userController.loadRegister);
user_route.post('/register',userController.insertUser);

user_route.get('/verify',userController.verifyMail);

user_route.get('/',auth.isLogin,userController.loginLoad)
user_route.get('/login',userController.loginLoad);
user_route.post('/login',userController.verifyLogin);

user_route.get('/home',userController.loadHome)


user_route.get('/otpverification',auth.isLogout,userController.loadverifyotp)
user_route.post('/otpverification',userController.verifyotp)


user_route.get('/logout',auth.isLogin,userController.userLogout);


user_route.get('/forget',auth.isLogout,userController.forgetLoad);
user_route.post('/forget',userController.forgetVerify);



user_route.get('/forget-password',auth.isLogout,userController.forgetPasswordLoad)
user_route.post('/forget-password',auth.isLogout,userController.resetPassword)

module.exports = user_route;



