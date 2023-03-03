const mongoose =require("mongoose")

const userschema =new  mongoose.Schema({
    name :{
    type:String,
    required:true
},
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:Boolean,
        required:true
    },
    is_verified:{
        type:Number,
        default:0
    },
    token:{
        type:Number,
        default:''
    },
    is_blocked:{
        type:Boolean,
        required:true
    }

});
module.exports= mongoose.model("User",userschema)