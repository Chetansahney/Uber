const mongoose=require('mongoose');
const { create } = require('./user.models');
const blacklistTokenSchema=new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{          
        type:Date,
        default:Date.now,
        expires:86400 //token will expire after 24 hours
    }
})
module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);