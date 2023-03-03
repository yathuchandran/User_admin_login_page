const User = require("../model/userModel");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer")
const config = require("../config/config")
const rendomString = require("randomstring")

let userRegData;
const otp = `${Math.floor(1000 + Math.random() * 90000)}`




const securePassword = async (password) => {
    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);
    }
}




//for send mail
const sendVerifyMail = async (name, email) => {
    try {
      
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });
        const mailoptions = {
            from: config.emailUser,
            to: email,
            subject: 'for verification mail',
            text:`${otp}`
        }
        transporter.sendMail(mailoptions, function (error, info) {
            if (error) {
                console.log("Error while sending email:", error);
            } else {
                
                console.log("Email has been sent:", info.response);
                res.redirect("/otpverification")
            }
            return otp;
        })

    } catch (error) {
        console.log(error.message);
    }
}



//for reset send mail
const sendResetPasswordMail = async (name, email, token) => {
    try {

    
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });
        const mailoptions = {
            from: config.emailUser,
            to: email,
            subject: 'for Reset Password mail',
            html: '<p>hii' + name + ', please click to <a href="http://127.0.0.1:3000/verify?id=' + user_id + '">Forget Password <?a> your mail.</p>'

        }
        transporter.sendMail(mailoptions, function (error, info) {
            if (error) {
                console.log("error"+error)
            }
                else{
                    console.log("Email has been sent:-",+info.response);
            }
            return otp;
        })

    } catch (error) {
        console.log(error.message);
    }
}



const loadRegister = async (req, res) => {
    try {

        res.render('users/registration')
    } catch (error) {
        console.log(error.message);
    }

}

// const insertUser = async(req,res)=>{
//     try{
//         var email = req.body.email
//         const userData = await User.findOne({ email: email });
//         // var emailMatch=await verify(userData.email, email)
//         if (userData==null) {
//             if(req.body.password==req.body.password2){
//         const spassword = await securePassword(req.body.password,10,'asderftgyi');
//         const user = new User({
//           name:req.body.name,
//           email: req.body.email,
//           mobile: req.body.mobile,
//           password:spassword,
//           is_admin: 0

//         })

//     const userData = await user.save(); //promising that wen user is inserted i will return the userdata
//        sendVerifyMail(req.body.name, req.body.email, userData._id)
//       res.render("users/registration", { message: "Your Registration has been  successfully. Please verify your mail." });
//     }else{
//       res.render("users/registration", { message: "passwords are not same Please verify " })
//     }
//     } else {
//       if(userData)

//       res.render("users/registration", { message: "user already exsist" });
//     }
//     } catch(error){
//         console.log(error.message);
//     }
// }


const insertUser = async (req, res) => {
    try {
        const name = req.body.name
        const email = req.body.email
        userRegData = req.body
        console.log(userRegData);

        const existUser = await User.findOne({ email: email })
        console.log(existUser)
        if (existUser == null) {
                console.log("name--"+name,email)
            await sendVerifyMail(name, email)

            //  const emailslice = [...email].join('').slice(8)
            res.redirect('/otpverification')

        }
        else {
            if (existUser.email == email) {
                res.render('users/registration', { message1: 'User Alredy Exist' })
            }
        }
    }
    catch (error) {
        console.log(error.message)
    }
}

//---------------------------------------------------------------------------------------------------------------

const loadverifyotp = async (req, res) => {
    try {
            
        res.render('users/otpverification')
    } catch (error) {
        console.log(error.message);
    }
}



const verifyotp = async (req, res) => {
    try {
        
        const password = await bcrypt.hash(userRegData.password, 10);
        console.log(password);
        const enteredotp = req.body.otp;
        console.log(userRegData)
        console.log(otp, enteredotp);

       

        if (otp == enteredotp) {
            const user = new User({
                name: userRegData.name,
                mobile: userRegData.mobile,
                email: userRegData.email,
                password: password,
                is_blocked: false,
                is_verified: false,
                is_admin:0
            })
            const userData = await user.save();
            console.log(userData);
            res.render('users/login', { message2: "Registration successful" })
        }
        else {
            res.render('users/otpverification', { message1: "Invalid otp" })

        }
    }
    catch (error) {
        console.log(error.message);
    }
}
console.log("---------helo--------------------");



//----------------------------------------------------------------------------------------


const verifyMail = async (req, res) => {
    try {
        const updateInfo = await User.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } })
        console.log(updateInfo);
        res.render("users/email-verified")
    } catch (error) {
        console.log(error.message);
    }
}


//login user methods start 
const loginLoad = async (req, res) => {
    try {
        res.render('users/login')
    } catch (error) {
        console.log(error.message);
    }
}


const verifyLogin = async (req, res) => {
    try {  

        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email })


        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)

            if (passwordMatch) {

                if (userData.is_verified === 0) {
                    res.render('users/home', { message: "Please verify your mail" })
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('users/home')
                }
            } else {
                res.render('users/login', { message: "Email and password is incorect" })
            }
        } else {
            res.render('users/login', { message: "Email and password is incorect" })
        }

    } catch (error) {
        console.log(error.message);
    }
}


const loadHome = async (req, res) => {
    try {
        res.render('users/home')
    } catch (error) {
        console.log(error.message);
    }
}


const userLogout = async (req, res) => {
    try {

        req.session.destroy()
        res.redirect('/')

    } catch (error) {
        console.log(error.message);
    }
}


//forget password

const forgetLoad = async (req, res) => {
    try {
        res.render('users/forget')
    } catch (error) {
        console.log(error.message);
    }
}


const forgetVerify = async (req, res) => {
    try {

        const email = req.body.email;
        const userData = await User.findOne({ email: email })
        if (userData) {

            if (userData.is_verified === 0) {
                res.render('users/forget', { message: "please verify your email " })

            } else {

                const rendomString = Randomstring.generate();
                const updateData = await User.updateOne({ email: email }, { $set: { token: Randomstring } });
                sendResetPasswordMail(userData.name, userData.email, Randomstring);
                res.render('users/forget', { message: "Please check your mail to reset your  password" })
            }
        } else {

            res.render('users/forget', { message: "User email is incorrect" })

        }

    } catch (error) {
        console.log(error.message);
    }
}




const forgetPasswordLoad = async (req, res) => {
    try {

        const token = req.query.token;
        const tokenData = await User.findOne({ token: token });
        if (tokenData) {
            res.render('forget-password', { user_id: tokenData_id })
        } else {
            res.render('404', { message: "Tokken is invalid" })
        }
    } catch (error) {
        console.log(error.message);
    }
}


const resetPassword = async (req, res) => {
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;

        const secure_Password = await securePassword(password);

        const updateData = await User.findByIdAndUpdate({ _id: user_id }, { $set: { password: secure_Password, token: '' } })

        res.redirect("/")
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    loadverifyotp,
    verifyotp



}


