import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        isFolder:{
            type:Boolean,
            required:true
        },
        image:{
            type:String,
            required: true
        },
        path:{
            type:String,
            required:true
        },
        updatedAt: {
            type:timestamps,
            required:true
        }
    }
)

const Entry = mongoose.model('Product', EntrySchema) //remember the product name should start with captital letter and must be singular so mongo internall does convert objects into products

export default Entry;