import { User } from "../models/user.model.js";
export const getUserInfo = async (id) => {
    const userDetails = await User.findById(id);
    return userDetails;
};
