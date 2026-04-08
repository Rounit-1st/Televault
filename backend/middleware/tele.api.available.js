import {getUserInfo} from "../services/getUseInfo.js"

export const isTelegramApiExistForAccount = async (req,res,next)=>{
    const id = req.id.id;
    const userDetails = await getUserInfo(id);
    console.log("User.details: ",userDetails);
    if(!userDetails.telegramBotToken
        ||!userDetails.telegramChatId){
        return res.status(400).json({success:false,message:"telegram api is empty"})
    }
    req.telegramBotToken = userDetails.telegramBotToken;
    req.telegramChatId = userDetails.telegramChatId;
    // console.log("req.telegramBotToken: ",req.telegramBotToken);
    // console.log("req.telegramChatId: ",req.telegramChatId, "req.telegramChatId: ",req.telegramChatId);
    next();
};