const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const captainSchema=new mongoose.Schema({
    name:{
        firstname:{ 
            type:String,
            required:true,  
            minlength:[3,"Firstname must be at least 3 characters long"]
        },
        lastname:{  
            type:String,
            minlength:[3,"Lastname must be at least 3 characters long"]
        }
    },

    email:{
        type:String,
        required:true,
        unique:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Please enter a valid email address"]
    },

    password:{
        type:String,
        required:true,
        select:false
    },

    socketID:{
        type:String
    },

    status:{
        type:String,
        enum:["available","unavailable"],
        default:"unavailable"
    },
    vehicle:{
        color:{
            type:String,
            required:true
        },
        model:{
            type:String,
            required:true
        },
        plate:{
            type:String,
            required:true,
            unique:true
        },
        capacity:{
            type:Number,
            min: [1, "Capacity must be at least 1"],
            required:true
        },
        vehicleType:{
            type:String,
            enum:["car","bike","auto"],
            required:true
        },
            location:{
                lat:
                {
                    type:Number,
                }
                ,
                lng:{
                    type:Number,
                }
            }
    }
})

captainSchema.methods.generateAuthToken=function(){const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'});
return token;}

captainSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

captainSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,10);
}

const Captain=mongoose.model('Captain',captainSchema);
module.exports=Captain;