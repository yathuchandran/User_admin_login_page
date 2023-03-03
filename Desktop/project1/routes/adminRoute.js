const express = require("express");
const admin_route = express();
const adminAuth = require("../middleware/adminAuth");


const session = require("express-session");
const  config = require("../config/config");
admin_route.use(session({secret:config.sessionSecret}));

const adminController =require("../controllers/adminController");
const productController=require("../controllers/productController")
const store=require("../middleware/multer");



admin_route.get('/',adminController.loadLogin);

admin_route.post('/',adminController.verifyLogin);

admin_route.get('/home',adminController.loadDashboard);

admin_route.get('/logout',adminController.logout);

admin_route.get('/dashboard',adminController.admiDashboard);


admin_route.get('/users',adminController.usersList)
admin_route.post('/users/block',adminController.blockUser);

admin_route.get('/product',adminAuth.isLogin,productController.listProduct)
admin_route.get('/addProduct',productController.productLoad);
admin_route.post('/addProduct',store.array('image',8),productController.addProduct)
admin_route.get('/editproduct',adminAuth.isLogin,productController.loadEditProduct);
admin_route.post('/editproduct',store.array('image',8),productController.editProduct)









// admin_route.get('/deleteuser',adminController.deleteUser);

// admin_route.get('*',function(req, res){

//     res.redirect('/admin');
// });

module.exports = admin_route;

