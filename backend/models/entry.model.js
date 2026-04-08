import mongoose, { mongo } from "mongoose";

const FolderSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        isFolder:{
            type:Boolean,
            required:true
        },
        path:{
            type:String,
            required:true
        },
        owner:{
             type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true
        },
        updatedAt: {
            type:timestamps,
            required:true
        }
    }
)

const FileSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        mimeType:{
            type:String,
            required:true
        },
        isFolder:{
            type:Boolean,
            required:true
        },
        downloadURL:{
            type:URL,
            required: true
        },
        fileId:{
            type:String,
            required: true
        },
        size:{
            type:Number,
            required:true       
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
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

const Folder = mongoose.model('Folder', FolderSchema) //remember the product name should start with captital letter and must be singular so mongo internall does convert objects into products
const File = mongoose.model('File', FileSchema)

export {Folder,File};