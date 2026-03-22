const userModel=require('../models/user.models');
const userService=require('../services/user.services');
const {validationResult}=require('express-validator');
const blacklistTokenModel=require('../models/blacklistTokens.model');
module.exports.register=async (req,res)=>{
    const errors=validationResult(req);//taking errors from the routes
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});//if there are errors then we are sending the error message to the client side
    }

    const {name,email,password}=req.body;//taking the data from the client side
    const hashedPassword=await userModel.hashPassword(password);//hashing the password before saving it to the database

    const user=await userService.createUser({firstname:name.firstname,lastname:name.lastname,email,password:hashedPassword});//creating a new user in the database using the createUser function from userService
    const token=user.generateAuthToken();//generating a token for the user using the generateAuthToken function from userModel
    res.status(201).json({user,token});//sending the user object and token to the client side
}

//login route

module.exports.login=async(req,res,next)=>{
    const errors=validationResult(req);//taking errors from the routes
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});//if there are errors then we are sending the error message to the client side
    }

    const {email,password}=req.body;//taking the data from the client side
    const user=await userModel.findOne({email}).select('+password');//finding the user in the database using the email and selecting the password field to compare it with the hashed password
    if(!user){
        return res.status(401).json({error:"Invalid email or password"});//if the user is not found then we are sending the error message to the client side
    }
    const isMatch=await user.comparePassword(password);//comparing the password from the client side with the hashed password in the database using the comparePassword function from userModel
    if(!isMatch){
        return res.status(401).json({error:"Invalid email or password"});//if the password does not match then we are sending the error message to the client side
    }

    const token=user.generateAuthToken();//generating a token for the user using the generateAuthToken function from userModel
    res.status(200).json({user,token});//sending the user object and token to the client side
}
module.exports.getUserProfile=(req,res,next)=>{
    res.status(200).json(req.user);//sending the user object to the client side
    
}

module.exports.logout=async (req,res,next)=>{
    res.clearCookie('token');
    const token=req.cookies.token || req.headers.authorization.split(' ')[1];
    await blacklistTokenModel.create({token});//blacklisting the token by saving it to the blacklistTokens collection in the database
    res.status(200).json({message:"Logged out successfully"});
}