const captainModel=require('../models/captain.models' );
const captainServices=require('../services/captain.services');
const {validationResult}=require('express-validator');
const blacklistTokenModel=require('../models/blacklistTokens.model');

module.exports.register=async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const { name, email, password, vehicle } = req.body;
    const isAlreadyExist = await captainModel.findOne({ email });
    if(isAlreadyExist){
        return res.status(400).json({message:"Captain with this email already exists"});
    }

        const hashedPassword=await captainModel.hashPassword(password);

        const captain=await captainServices.register({
            firstname: name.firstname, lastname: name.lastname,email,password: hashedPassword,color: vehicle.color,model:vehicle.model,plate:vehicle.plate,capacity:vehicle.capacity,vehicleType:vehicle.vehicleType
        });
        
        const token=captain.generateAuthToken();
        
        return res.status(201).json({token,captain});
    }


    module.exports.loginCaptain=async (req,res,next)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(401).json({errors:errors.array()});
        }
        const {email,password}=req.body;
        const captain=await captainModel.findOne({email}).select('+password');
        if(!captain){
            return res.status(401).json({message:"Captain with this email does not exist"});
        }
        const isMatch=await captain.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid email or password"});
        }
        const token=captain.generateAuthToken();
        res.cookie('token',token);
        return res.status(200).json({token,captain});
    }


module.exports.getCaptainProfile=(req,res,next)=>{
    res.status(200).json({captain:req.captain});
}


module.exports.logoutCaptain=async (req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization.split(' ')[1];
   await blacklistTokenModel.create({token});
    res.clearCookie('token'); 
    res.status(200).json({message:"Logged out successfully"});
}



