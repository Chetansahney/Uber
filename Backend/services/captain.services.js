const captainModel=require('../models/captain.models' );

module.exports.register=async ({firstname,lastname,email,password,color,model,plate,capacity,vehicleType})=>{
    if(!firstname || !email || !password || !color || !model || !plate || !capacity || !vehicleType){
        throw new Error("All fields are required");
    }   
    const captain=captainModel.create({
        name:{
            firstname,
            lastname    
        },
        email,
        password,
        vehicle:{
            color,
            model,
            plate,
            capacity,
            vehicleType
        }           

    })
    return captain;
}
