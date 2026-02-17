import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name:{
            type:String, //upper case
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema) //remember the product name should start with captital letter and must be singular so mongo internall does convert objects into products

export default Product