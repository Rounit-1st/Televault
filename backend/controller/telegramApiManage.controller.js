import { User } from "../models/user.model.js";

const setTelegramApi = async(req,res)=>{
    const id = req.id.id;
    const {telegramBotToken, telegramChatId} = req.body;
    // console.log("id",id," telegram bot token: ", telegramBotToken, " telegram chat id: ", telegramChatId);
    if(!telegramBotToken || !telegramChatId)return res.status(400).json({success:false,message:"Please enter both bot token and chat id"})

    try{
        await User.findByIdAndUpdate(id,{telegramBotToken, telegramChatId});
        return res.status(200).json({success:true,message:"telegram api keys successfully added"})
    }catch(err){
        return res.status(400).json({success:false,message:"Internal server error"})
    }
}

const updateTelegramApi = async(req,res)=>{
    const id = req.id.id;
    const {telegramBotToken, telegramChatId} = req.body;

    if(!telegramBotToken && !telegramChatId)return res.status(400).json({success:false,message:"No fields to update"})

    try{
        if(telegramBotToken) await User.findByIdAndUpdate(id,{telegramBotToken});
        return res.status(200).json({success:true,message:"telegramBotToken successfully updated"})
        if(telegramChatId) await User.findByIdAndUpdate(id,{telegramChatId});
        return res.status(200).json({success:true,message:"telegramChatId successfully updated"})
    }catch(err){
        return res.status(400).json({success:false,message:"Internal server error"})
    }
}

const removeTelegramApi = async(req,res)=>{
    const id = req.id.id;
    const telegramBotToken = "";
    const telegramChatId = "";
            
    try{
        const object = await User.findByIdAndUpdate(id,{telegramBotToken, telegramChatId},{new:true});
        return res.status(200).json({success:true,message:"Successfully cleared bot token and chat id", telegramApi: object.telegramBotToken})
    }catch(err){
        return res.status(400).json({success:false,message:"Internal server error"})
    }
}

const getTelegramApi = async(req,res)=>{
    const id = req.id.id;
    // const {telegramApi} = "";

    // if(!telegramApi)return res.status(400).json({success:false,message:"Api key feild is already empty"})
        
    try{
        const userDetails = await User.findById(id);
        if(!userDetails) return res.status(404).json({success:false,message:"User not found"})
        return res.status(200).json({success:true, telegramBotToken: userDetails.telegramBotToken, telegramChatId: userDetails.telegramChatId})
    }catch(err){
        return res.status(400).json({success:false,message:"Internal server error"})
    }
}

export {setTelegramApi, updateTelegramApi, removeTelegramApi, getTelegramApi}