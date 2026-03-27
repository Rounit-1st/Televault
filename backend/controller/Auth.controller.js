import { User } from "../models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const AuthLogin = async(req,res) =>{
    console.log('New Request comes')
    const user = req.body;
    if(!user.password||!user.email)return res.status(400).json({success:false,message:"Please provide all fields"})
    
    const dbUser = await User.findOne({email:user.email})
    // console.log(dbUser);
    // if(!dbUser)return res.status(400).json({success:false,message:"User is not registered"})

    console.log(dbUser.email,user.email)
    if(!dbUser)return res.status(400).json({success:false,message:"No Account Found"})
    const isMatch = await bcrypt.compare(user.password,dbUser.password)
    if(!isMatch)return res.status(400).json({success:false, message: "Invalid credentials" });
    console.log(isMatch);

    try{
        const token = jwt.sign(
            {id: dbUser._id},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );
        console.log(token);
        res.cookie("televaultToken",token);
        return res.status(200).json({success:true,message:"Login Successful"})
    }catch(err){
        return res.status(400).json({success:false,message:'Internal server error'})
    }
}

export const AuthRegister = async(req,res) =>{
    console.log('New Register request comes')
    const user = req.body;
    if(!user.email||!user.password){
        return res.status(400).json({success:false, message:"Please provide all fields"})
    }
    const dbUser = await User.findOne({email:user.email});
    console.log("dbUser:",dbUser);
    if(dbUser){
        return res.status(400).json({success:false, message:"Account already exist with the email"})
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({'email':user.email,'password':hashedPassword});
    try{ console.log(newUser);
        await newUser.save();
        res.status(200).json({success:true, message:"User details saved"})
        // const productList = await Product.find()
        // res.status(200).json({success:true,productList})
    }
    catch{
        res.status(500).json({success:false,message:"Some error occured in Server"})
    }
}

export const AuthUpdateInfo = async(req,res)=>{
    const id = req.id.id;
    const user = req.body;
    const dbUser = await User.findById(id);
    console.log(dbUser);
    if(!dbUser)return res.status(400).json({success:false,message:"User doesn't exist"})

    try{
        user.password = await bcrypt.hash(user.password, 10);
        const updateDetails = await User.findByIdAndUpdate(id,user, {runValidators:true});
        console.log(updateDetails);
        return res.status(200).json({success:true,message:"Updated user details", data:updateDetails})
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}

export const AuthDelete = async (req,res)=>{
    const id = req.id.id;
    if(!User.findById(id))res.status(400).json({success:false,message:"User Doesnt Exist"})

    try{
        await User.findByIdAndDelete(id);
        res.status(200).json({success:true,message:"User deleted successfully"})
    }
    catch{
        res.status(500).json({success:false,message:"Internal server error"});
    }
}

export const AuthSignOut = async(req,res)=>{
    res.clearCookie('televaultToken')
    res.status(200).json({success:true, message:'Cookie cleared'})
}