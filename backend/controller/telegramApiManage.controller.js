import { User } from "../models/user.model.js";

const setTelegramApi = async(req,res)=>{
    const id = req.id.id;
    const {telegramApi} = req.body;
    console.log("id",id," telegram api: ", telegramApi);
    if(!telegramApi)return res.status(400).json({success:false,message:"Please enter api keys"})

    try{
        await User.findByIdAndUpdate(id,{telegramApi});
        return res.status(200).json({success:true,message:"telegram api keys successfully added"})
    }catch(err){
        return res.status(400).json({success:false,message:"Internal server error"})
    }
}

const updateTelegramApi = async(req,res)=>{
    const id = req.id.id;
    const {telegramApi} = req.body;

    if(!telegramApi)return res.status(400).json({success:false,message:"Please enter api keys"})
        
    try{
        await User.findByIdAndUpdate(id,{telegramApi});
        return res.status(200).json({success:true,message:"telegram api keys successfully updated"})
    }catch(err){
        return res.status(400).json({success:false,message:"Internal server error"})
    }
}

const removeTelegramApi = async(req,res)=>{
    const id = req.id.id;
    const telegramApi = "";
        
    try{
        const object = await User.findByIdAndUpdate(id,{telegramApi},{new:true});
        return res.status(200).json({success:true,message:"Successfully cleared Api keys"})
    }catch(err){
        return res.status(400).json({success:false,message:"Internal server error"})
    }
}

const getTelegramApi = async(req,res)=>{
    const id = req.id.id;
    // const {telegramApi} = "";

    // if(!telegramApi)return res.status(400).json({success:false,message:"Api key feild is already empty"})
        
    try{
        const userDetails = await User.findByIdAndUpdate(id);
        return res.status(200).json({success:true, telegramApi: userDetails.telegramApi})
    }catch(err){
        return res.status(400).json({success:false,message:"Internal server error"})
    }
}

export {setTelegramApi, updateTelegramApi, removeTelegramApi, getTelegramApi}