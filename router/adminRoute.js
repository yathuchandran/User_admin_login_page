const express = require("express");
const admin_route = express();

const session = require("express-session");
const  config = require("../config/config");
admin_route.use(session({secret:config.sessionSecret}));


const bodyParser = require ("body-parser");

admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));


admin_route.set('views engine','ejs');
admin_route.set('views','./views/admin')

const adminAuth = require("../middleware/adminAuth");

const adminController =require("../controller/adminController");

admin_route.get('/',adminAuth.isLogout,adminController.loadLogin);

admin_route.post('/',adminController.verifyLogin);

admin_route.get('/home',adminAuth.isLogin,adminController.loadDashboard);

admin_route.get('/logout',adminController.logout);

admin_route.get('/dashboard',adminAuth.isLogin,adminController.admiDashboard);

admin_route.get('/new-user',adminAuth.isLogin,adminController.newUserLoad);
admin_route.post('/new-user',adminController.addUser);

admin_route.get('/edit-user',adminAuth.isLogin,adminController.editUserLoad);

admin_route.post('/edit-user',adminController.updateUsers);

admin_route.get('/deleteuser',adminController.deleteUser);

admin_route.get('*',function(req, res){

    res.redirect('/admin');
});

module.exports = admin_route;

