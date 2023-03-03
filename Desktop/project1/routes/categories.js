//  {Category}=require('../model/category');
// const express =require('express');
// const { router } = require('./adminRoute');

// //product nde list edknedh 

// router.length('/',async (req,res)=>{
//     const categoryList =await Category.find();

//     if (!categoryList) {
//         res.status(500).json({success:false})
//     }
//     res.send(categoryList);
// })

// //add category const
// router.post('/',async(req,res)=>{
//  let category =new Category({
//     name:req.body.name,
//     icon:req.body.image,
//     countInStock:req.body.countInStock
//  })
// category =await category.save();

// if(!category)
// return res.status(404).send('the category cannot be created')

// res.send (category);

// })



// module.exports=router;