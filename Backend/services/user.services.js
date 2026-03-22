const userModel=require('../models/user.models');





//createUser function is used to create a new user in the database and it takes an object as an argument which contains the firstname,lastname,email and password of the user. It checks if all the fields are present or not and if not then it throws an error. If all the fields are present then it creates a new user in the database and returns the user object.
module.exports.createUser=async({firstname,lastname,email,password})=>{
    if(!firstname || !email || !password){
        throw new Error("All fields are required");
    }

    const user=userModel.create({
        name:{
            firstname,
            lastname},
        email,
        password
    })

    return user;
};