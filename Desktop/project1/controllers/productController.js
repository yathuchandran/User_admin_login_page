const mongoose =require ('mongoose')
const Product = require("../model/product");
const {findByIdAndUpdate,findbyId }=require("../model/product")

const multer = require('multer');
const config = require("../config/config")


//LIST PRODUCT----------------------------
const listProduct=async(req,res)=>{
    try {
        const productData=Product.find()
        res.render('admin/product',{product:productData})
    } catch (error) {
        console.log(error.message);
    }
}


//LOAD product----------------------------------------
const productLoad = async (req, res) => {
    try {
        res.render('admin/addProduct');
    } catch (error) {
        console.log(error.message);
    }
}


//ADD PRODUCT--------------------------------------------------------------
const addProduct = async (req, res) => {
    try {
        const name =req.body.name;
        const  productData =await Product.findOne({name:name})

        const images=[]
        const file=req.file
        file.forEach(element => {
            const image=element.filename
            images.push(image)
        });




        if(productData==null){
            const product=new Product({
                name:req.body.name,
                description:req.body.description,
                image:images,
                category:req.body.category,
                price :req.body.price,
                brand:req.body.brand,
                quantity:req.body.brand,
                is_blocked:false
            })
            const productData=await Product.save();
            console.log(productData);
            res.render("admin/addProduct",{message:"Product added succesfuly"});
        }
        else{

            if (productData.name==name) 
                res.render('admin/addProduct', { message: 'something wrong..' });
        }
    } catch (error) {
        console.log(error.message);
    }
}



//LOAD EDIT PRODUCT-----------------------------------

const loadEditProduct=async(req,res)=>{
    try {
        const id=req.query.id
        const productData=await Product.findbyId({_id:id})
        if(productData){
            res.render('admin/editproduct',{product:productData})
        }
        else{
            res.render('admin/product')
        }
        
    } catch (error) {
        console.log(error.message);
    }
}


//EDIT PRODUCT
const editProduct=async(req,res)=>{
    try {
        const id=req.query.id
        const images=[]
        const file=req.files
        file.findEach(element=>{
            const image=element.filename
            images.push(images)
        })

        const productData=await Product.findByIdAndUpdate({_id:id},{
            name:req.body.name,
            description:req.body.description,
            image:images,
            category:req.body.category,
            price:req.body.price,
            brand:req.body.brand,
            quantity:req.body.quantity
        },{new:true})
    } catch (error) {
        console.log(error.message);
    }
}


//block product--------------------------------------------------------------
const blockProduct=async(req,res)=>{
    const blockid=req.params.id
    const blockProductData=await Product.findById(blockid)
    const block_status=blockProductData.is_blocked

    try {
        const final=await Product.findByIdAndUpdate(blockid,{$set:{is_blocked:!block_status}},{new:true})
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    listProduct,
    productLoad,
    addProduct,
    loadEditProduct,
    editProduct,
    blockProduct

}
