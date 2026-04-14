import mongoose, { mongo } from "mongoose";

// const FolderSchema = new mongoose.Schema(
//     {
//         name:{
//             type:String,
//             required:true
//         },
//         isFolder:{
//             type:Boolean,
//             required:true
//         },
//         path:{
//             type:String,
//             required:true
//         },
//         owner:{
//             type:mongoose.Schema.Types.ObjectId,
//             ref:'User',
//             required: true
//         }
//     },
//     {timestamps: true}
// )

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
        telegramFileId:{
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
        thumbnailUrl:{
            type:URL,
            required:false
        }
    },{timestamps: true}
)

// const Folder = mongoose.model('Folder', FolderSchema) //remember the product name should start with captital letter and must be singular so mongo internall does convert objects into products
const File = mongoose.model('File', FileSchema)

export {File};