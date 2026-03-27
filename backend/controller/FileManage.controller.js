import { User } from "../models/user.model";

export const telegramApiPost = async(req,res)=>{
    const id = req.id.id;
    const {telegramApi} = req.body;
    if(!telegramApi)res.status(400).json({success:false, message:"Telegram Api field is not available"})

    const dbUser = await User.findById(id);
    console.log(dbUser);
    if(!dbUser)return res.status(400).json({success:false,message:"User doesn't exist"})

    try{
        const addApiDetails = await User.findByIdAndUpdate(id,user, {runValidators:true});
        console.log(updateDetails);
        return res.status(200).json({success:true,message:"Updated user details", data:updateDetails})
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}