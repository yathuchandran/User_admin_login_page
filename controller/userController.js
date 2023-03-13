const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');

const { response } = require('../router/userRoute.js');


const securePassword = async (password) => {
   try {
     
      const PasswordHash = await bcrypt.hash(password, 10);
      return PasswordHash;

   } catch (error) {
      console.log(error.message);

   }
}

const LoadRegister = async (req, res) => {
   try {

      res.render('registration');

   } catch (error) {
      console.log(error.message);
   }

}

const insertUser = async (req, res) => {

   try {
      var email = req.body.email

const r=req.body;
      if(r.password!=""&&r.password2!=""&&r.email!=""){
      const userData = await User.findOne({ email: email });
      // var emailMatch=await verify(userData.email, email)
      if (userData==null) {
         if(req.body.password==req.body.password2){    
      req.body.password = await bcrypt.hash(req.body.password,10);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        is_admin: 0,
       
      });
      const userData = await user.save(); //promising that wen user is inserted i will return the userdata
        res.render("registration", {message: "Registration successful" });
      } else{
         res.render("registration", {message: "passwords not match" });
      }
      }else {
        if(userData)
        res.render("registration", {message: "user already exsist" });
      }
   }
}
   catch (error) {
      console.log(error.message);
    }
   
  };

//    try {
//       const spassword = await securePassword(req.body.password)
//       const user = new User({
//          name: req.body.name,
//          email: req.body.email,
//          mobile: req.body.mobile,
//          password: spassword,
//          is_admin: 0
//       });

//       const userData = await user.save();

//       if (userData) {
//          res.render('registration', { message: "Your Registration has been successfully." });
//       }
//       else {
//          res.render('registration', { message: "Your Registration has been failed." });
//       }
//    } catch (error) {
//       console.log(error.message);

//    }
// }






const loginload = async(req,res)=>{

   try {
      if(req.session.user_id){
         res.redirect("/home")
      }else{
          res.render('login')
      }

   } catch (error) {
      console.log(error.message);
   }
}



const verifyLogin = async(req,res)=>{

   try {
      
      const email = req.body.email;
      const password = req.body.password;
if(email!=""&&password!=""){
   const userData = await  User.findOne({email:email })

   if (userData) {

   const passwordMatch =  await bcrypt.compare(password,userData.password);

   if (passwordMatch) {
      if (userData.is_verified === 0) {
         res.render('login',{message:"please verify your mail."});
         
      }else{
         req.session.user_id = userData._id; 
         res.redirect('/home');
      }
      
   }
   else{ 
     
      res.render('login',{message:"Email and hgpassword is incorect"})
   }
   }
}
   } catch (error) {
      console.log(error.message);
   }


}


const loadHome =async(req,res)=>{
   try {
   const userData = await User.findById({ _id:req.session.user_id})
      res.render('home',{user:userData})
      
   } catch (error) {
      console.log(error.message);
   }
}



const userlogout =async (req,res)=>{
   try {

      
      req.session.destroy();
      res.redirect('/');

   } catch (error) {
      console.log(error.message);
   }
}

module.exports = {
   LoadRegister,
   insertUser,
   loginload,
   verifyLogin,
   loadHome,
   userlogout,
}