import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        telegramBotToken:{
            type:String,
            default:""
        },
        telegramChatId:{
            type:String,
            default:""
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
)

// const FileSchema = new mongoose.Schema(
//     {
//         name:{
//             type:String,
//             required:true
//         },
//         isFolder:{
//             type:Boolean,
//             required:true
//         },
//         downloadLink:{
//             type:URL,
//             required: true
//         },
//         fileId:{
//             type:String,
//             required: true
//         },
//         path:{
//             type:String,
//             required:true
//         },
//         updatedAt: {
//             type:timestamps,
//             required:true
//         }
//     }
// )

const User = mongoose.model('User', UserSchema) //remember the product name should start with captital letter and must be singular so mongo internall does convert objects into products

export {User};