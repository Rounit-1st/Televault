import jwt from 'jsonwebtoken';

export const protect = async (req,res,next)=>{
    const token = await req.cookies.televaultToken;
    console.log(token);
    if(!token)return res.status(401).json({sucess:false,message:"Not authorized"});
    
    try{
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        req.id=decoded;
        console.log("Request leaving with token:",req.id);
        next();
    }catch{
        res.status(401).json({sucess:false,message:"Invaild Token"});
    }
};