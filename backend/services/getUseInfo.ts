import { User } from "../models/user.model.js"

export const getUserInfo = async (id:number)=>{
    const userDetails = await User.findOneById(id);
    return userDetails;
}