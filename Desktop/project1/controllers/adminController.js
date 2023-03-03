const Admin = require("../model/adminModel");
const User =require("../model/userModel")
const nodemailer = require("nodemailer");
const config = require("../config/config")
const bcrypt = require('bcrypt');
const randomstring = require('randomstring')




const loadLogin = async (req, res) => {
    try {

        res.render("admin/login")

    } catch (error) {
        console.log(error.message);
    }
}


const verifyLogin = async (req, res) => {
    try {
    const email = req.body.email;
    const password = req.body.password;
    if(email!=""&&password!=""){
        const adminData = await Admin.findOne({ email: email })
        
        if (adminData) {
            req.session.user_id = adminData._id;
            req.session.admin=true;
            res.redirect("/admin/home")
        } else {
            req.session.admin=false;

            res.render('admin/login', { message: "Email and password is incorrect" });
        }
    }
    } catch (error) {
        console.log(error.message);
    }
}



const loadDashboard = async (req, res) => {
    try {
        res.render('admin/home')
        
    } catch (error) {
        console.log(error.message);
    }
}



const logout = async (req, res) => {
    try {

        
        req.session.admin=false;
        req.session.destroy()
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message);
    }
}



const admiDashboard = async (req, res) => {
    try {

        const adminData = await Admin.find({ is_admin: 0 });
        console.log(adminData);
        res.render('admin/dashboard', { users: adminData });
    } catch (error) {
        console.log(error.message);
    }
}


const usersList = async(req, res) => {
    try {

        const userData =await User.find()
        if (userData) {
            res.render('admin/users',{users:userData});
        } else {
            res.redirect('/admin/dashboard');
        }
        
    } catch (error) {
        console.log(error.message);
    }
}



const blockUser=async(req,res)=>{
   
    const blockid =req.query.id;
    const blockUserData = await User.findById(blockid);
    const block_status = blockUserData.is_blocked;
    try {
       const final =await User.findByIdAndUpdate(
        blockid,
        {$set:{is_blocked: !block_status}},
        {new:true}
       )
       res.redirect("/admin/users");
    } catch (error) {
        console.log(error.message);
    }
}


// const blockUser = async (req, res) => {
//     const blockid = req.query.id;
//     console.log("id" + req.query.id);
//     const blockUserData = await User.findById(blockid);
  
//     const blcok_status = blockUserData.is_blocked;
//     try {
//       const final = await User.findByIdAndUpdate(
//         blockid,
//         { $set: { is_blocked: !blcok_status } },
//         { new: true }
//       );
//       res.send(final); // send updated user data to the client
//     } catch (error) {
//       console.log(error.message);
//       res.status(500).send("Error blocking user");
//     }
//   };
  



//---product add akandh---------------------------promise use cheidh

// ProductLoad =(req,res)=>{
//     Product.find({isDeleted:false})
//     .sort({updatedAt: -1})
//     .then((products)=>{
//         req.session.products=products;
//         res.render("admin/adminProducts",{
//             products,
//             adminMessage:req.session.productMessage,
//         })
//     })
//     .catch((error)=>{
//         console.log(error.message);
//     })
// };
// exports.productAdd =(req,res)=>{
// }



//delete user 

// const deleteUser = async (req, res) => {
//     try {

//         const id = req.query.id;
    
//         await Admin.deleteOne({ _id: id })
//         res.redirect('/admin/dashboard');

//     } catch (error) {
//         console.log(error.message);
//     }
// }


module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    admiDashboard,
    usersList,
    blockUser,
}