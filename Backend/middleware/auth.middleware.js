const userModel=require('../models/user.models');
const jwt=require('jsonwebtoken');  
const bcrypt=require('bcrypt');
const blacklistTokenModel=require('../models/blacklistTokens.model');
const captainModel=require('../models/captain.models' );

module.exports.authUser=async (req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization.split(' ')[1];//taking the token from the cookies or from the header
    if(!token){
        return res.status(401).json({message:"unAuthorised"});
    }
    const isBlacklisted=await blacklistTokenModel.findOne({token: token});//checking if the token is blacklisted or not by finding it in the blacklistTokens collection in the database
    if(isBlacklisted){
        return res.status(401).json({message:"unAuthorised"});
    }
    try
    {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);//verifying the token using the secret key
        const user=await userModel.findById(decoded._id);//finding the user in the database using the id from the token
        req.user=user;
        return next();
    }
    catch(err){
        return res.status(401).json({message:"unAuthorised"});
    }   
}


module.exports.authCaptain=async (req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"unAuthorised"});
    }
    const isBlacklisted=await blacklistTokenModel.findOne({token: token});
    if(isBlacklisted){
        return res.status(401).json({message:"unAuthorised"});
    }
    try
    {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const captain=await captainModel.findById(decoded._id);
        req.captain=captain;
        return next();
    }
    catch(err){
        return res.status(401).json({message:"unAuthorised"});
    }   
}