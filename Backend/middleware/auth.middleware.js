const userModel=require('../models/user.models');
const jwt=require('jsonwebtoken');  
const bcrypt=require('bcrypt');
const blacklistTokenModel=require('../models/blacklistTokens.model');

module.exports.authUser=async (req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization.split(' ')[1];//taking the token from the cookies or from the header
    if(!token){
        return res.status(401).json({message:"unAuthprised"});
    }
    const isBlacklisted=await blacklistTokenModel.findOne({token: token});//checking if the token is blacklisted or not by finding it in the blacklistTokens collection in the database
    if(isBlacklisted){
        return res.status(401).json({message:"unAuthprised"});
    }
    try
    {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);//verifying the token using the secret key
        const user=await userModel.findById(decoded._id);//finding the user in the database using the id from the token
        req.user=user;
        return next();
    }
    catch(err){
        return res.status(401).json({message:"unAuthprised"});
    }   
}
