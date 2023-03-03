const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
      type:String,
      required:true,
    },
    description: {
      type:String,
      required:true,
    },
    image: {
      type:Array,
    }, 
    price: {
      type:Number,
      required:true,
    },
    category:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'category',
      required:true
    },
    brand:{
      type:String,
      required:true,
    },
   
    quantity:{
      type:Number,
      required:true,
    },
    is_blocked:{
      type:Boolean,
      required:true
    }
  });
  module.exports = mongoose.model('Product', productSchema);

