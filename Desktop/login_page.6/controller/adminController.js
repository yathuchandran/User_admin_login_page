const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const randomstring = require('randomstring')
const mongoose=require("mongoose")

const loadLogin = async (req, res) => {
    try {
        res.render("login")

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

                if (userData.is_admin === 0) {
                    req.session.admin=false;

                    res.render('login', { message: "Email and password is incorrect" });
                }
                else {
                    req.session.user_id = userData._id;
                    req.session.admin=true;
                    res.redirect("/admin/home")

                }

            } else {
                req.session.admin=false;

                res.render('login', { message: "Email and password is incorrect" });
            }
        } else {
            req.session.admin=false;

            res.render('login', { message: "Email and password is incorrect" });
        }


    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async (req, res) => {
    try {
        if(req.session.admin){
        const userData = await User.findById({ _id: req.session.user_id })
        res.render('home', { admin: userData })
        }else{
            res.redirect("/admin")
        }
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

        const userData = await User.find({ is_admin: 0 });
        res.render('dashboard', { users: userData });
    } catch (error) {
        console.log(error.message);
    }
}

//add new work start

const newUserLoad = async (req, res) => {
    try {
        res.render('new-user');

    } catch (error) {
        console.log(error.message);
    }
}


const securePassword = async (password) => {
    try {
       // sendVerifyMail(req, body, name, req.body.email,)
       const PasswordHash = await bcrypt.hash(password, 10);
       return PasswordHash;
 
    } catch (error) {
       console.log(error.message);
 
    }
 }


const addUser = async (req, res) => {
    try {
       
        const name = req.body.name;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const password = randomstring.generate(8)

        const spassword = await securePassword(password)

     

        const user = new User({
            name: name,
            email: email,
            mobile: mobile,
            password: spassword,
            is_admin:0
        })

        const userData = await user.save();
        if (userData) {
            res.redirect('/admin/dashboard');
        } else {
            res.render('new-user', { message: 'something wrong..' });
        }

    } catch (error) {
        console.log(error.message);
    }
}


// edit user functionalty



const editUserLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const objectId = mongoose.Types.ObjectId(id);

        const userdata = await User.findOne({ _id: objectId });

        if (userdata) {
            res.render('edit-user', { user: userdata });

        } else {
            res.redirect('/admin/dashboard');
        }

    } catch (error) {
        console.log(error.message);
    }
};

const updateUsers = async (req, res) => {
    try {
        console.log("update users")
        const userData = await User.findByIdAndUpdate({ _id: req.query.id}, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile } });
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error.message);
    }
}

//delete user 

const deleteUser = async (req, res) => {
    try {

        const id = req.query.id;
    
        await User.deleteOne({ _id: id })
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    admiDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser
}