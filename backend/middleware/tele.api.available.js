import {getUserInfo} from "../services/getUseInfo.js"

export const isTelegramApiExistForAccount = async (req,res,next)=>{
    const id = req.id.id;
    const userDetails = await getUserInfo(id);
    console.log("User.details: ",userDetails);
    if(!userDetails.telegramApi||''){
        return res.status(400).json({success:false,message:"telegram api is empty"})
    }
    return res.status(200).json({success:true,message:"ok lil bro"})
};