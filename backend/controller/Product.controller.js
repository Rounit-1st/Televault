import Product from '../models/entry.model.js';

export const addProduct = async(req,res) =>{
    // console.log('New Request comes')
    const product = req.body
    if(!product.name||!product.price||!product.image){
        return res.status(400).json({success:false, message:"Please provide all feilds"})
    }
    const newProduct = new Product(product)
    try{
        await newProduct.save();
        res.status(200).json({success:true, message:"Product details saved"})
    }
    catch{
        return res.status(500).json({success:false, message:"Internal Server errror"})
    }
}

export const getAllProduct = async(req,res) =>{
    console.log('New Request comes')
    try{
        const productList = await Product.find()
        res.status(200).json({success:true,productList})
    }
    catch{
        res.status(500).json({success:false,message:"Some error occured in Server"})
    }
}

export const upDateProduct = async(req,res)=>{

    const {id} = req.params
    const product = req.body
    if(!Product.findById(id))res.status(404).json({success:false,message:"Invalid Product Id"})

    try{
        const updatedProduct = await Product.findByIdAndUpdate(id,product, {new:true})
        res.status(200).json({success:true,updatedProduct})
    }catch{
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export const deleteProduct = async(req,res) =>{
    const {id} = req.params;

    try{
        await Product.findByIdAndDelete(id);
        res.status(200).json({success:true,message:'Product deleted sucessfully'})
    }
    catch(error){
        res.status(404).json({success:false, message:"Product not found"})
    }
}