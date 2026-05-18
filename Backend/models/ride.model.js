const mongoose=require('mongoose');

const rideSchema=new mongoose.Schema({
    user :
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    ,
    origin : {
        type: String,
        required: true
    },
    destination : {
        type: String,
        required: true
    },
    captain:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain'
    },
    fare: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['requested', 'accepted','ongoing', 'completed', 'cancelled'],
        default: 'requested'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    distance:{
        type: Number
    }
    ,duration:{
        type: Number
    }
    ,paymentID:{
        type: String
    }
    ,orderID:{
        type: String
    },
    signature:{
        type: String
    }
    ,
    otp:{
        type: String,
        select : false,
        required: true
    }
});

module.exports=mongoose.model('ride',rideSchema);