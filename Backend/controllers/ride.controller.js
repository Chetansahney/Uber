const rideservice=require('../services/ride.services');
const { validationResult } = require('express-validator');
const mapservice=require('../services/maps.services');
const userModel=require('../models/user.models');
const { sendMessagetoSocketID } = require('../socket');
const rideModel=require('../models/ride.model');

module.exports.createRide=async (req,res)=>{
    console.log('createRide called ✅');
    console.log('req.body:', req.body);
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {origin,destination,vehicleType}=req.body;
    try {
    const { ride, otp } = await rideservice.createRide({ 
        origin, destination, user: req.user._id, vehicleType 
    });

    // ✅ do all work BEFORE sending response
    const pickupLocation = await mapservice.getLocationCoordinates(origin);
    const dropoffLocation = await mapservice.getLocationCoordinates(destination);
    console.log("Pickup location:", pickupLocation);
    console.log("Dropoff location:", dropoffLocation);

    const nearbyCaptains = await mapservice.getCaptainsNearby(
        pickupLocation.latitude,
        pickupLocation.longitude,
        10
    );
    console.log("Nearby captains:", nearbyCaptains);

    // Notify nearby captains via socket
    const ridewithUser=await rideModel.findOne({ _id: ride._id }).populate('user');
    nearbyCaptains.forEach(captain => {
        if (!captain.socketId) {
            return;
        }
        console.log(captain,ride);
        sendMessagetoSocketID(captain.socketId, {
            event: 'new-ride',
            data: ridewithUser
        
        });
    });

    // ✅ send response LAST
    res.status(201).json({ message: "Ride created successfully", ride, otp });

} catch (error) {
    console.error("Error in createRide controller:", error);
    res.status(500).json({ error: "An error occurred while creating the ride." });
}
}

module.exports.calculateFare=async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {origin,destination}=req.query;
    try{
        const fare=await rideservice.calculateFare(origin,destination);
        res.json(fare);
    }
    catch(error){
        console.error("Error in calculateFare controller:",error);
        res.status(500).json({error:"An error occurred while calculating the fare."});
    }
}

module.exports.confirmRide=async (req,res)=>{

    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {rideId}=req.body;

    try{
        const ride=await rideservice.confirmRide(rideId,req.captain._id);
        const ridePopulated = await rideModel.findById(ride._id)
            .populate('user')
            .populate('captain');
        console.log('Captain in ride:', JSON.stringify(ridePopulated?.captain));
        const userSocket = await userModel.findById(ride.user._id).select('socketId');
        const socketId = userSocket?.socketId;
        if (!socketId) {
            console.warn('No socketId for user:', ride.user._id);
        } else {
            sendMessagetoSocketID(socketId,{
                event:'ride-confirmed',
                data:ridePopulated ? ridePopulated.toObject() : ride.toObject()
            });
        }
        res.json({message:"Ride confirmed successfully",ride: ridePopulated || ride});
    }
    catch(error){
        console.error("Error in confirmRide controller:",error);
        res.status(500).json({error:"An error occurred while confirming the ride."});
    }
}

module.exports.getRideById=async (req,res)=>{
    const { rideId } = req.params;
    if (!rideId) {
        return res.status(400).json({ error: 'Ride ID is required.' });
    }

    try {
        const ride = await rideModel.findById(rideId)
            .populate('user')
            .populate('captain');
        if (!ride) {
            return res.status(404).json({ error: 'Ride not found.' });
        }
        res.json(ride);
    } catch (error) {
        console.error('Error in getRideById controller:', error);
        res.status(500).json({ error: 'An error occurred while fetching the ride.' });
    }
}

module.exports.startRide=async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const { rideId, otp } = req.body;
    console.log('startRide payload:', { rideId, otp });

    try{
        const ride = await rideservice.startRide(rideId, req.captain._id, otp);
        const userSocket = await userModel.findById(ride.user._id).select('socketId');
        const socketId = userSocket?.socketId;
        if (socketId) {
            sendMessagetoSocketID(socketId,{
                event:'ride-started',
                data:ride.toObject()
            });
        }
        res.json({message:"Ride started successfully",ride});
    }
    catch(error){
        console.error("Error in startRide controller:", error.message || error);
        const status = error.message === 'Invalid OTP.' ? 400 : 500;
        res.status(status).json({error:error.message || "An error occurred while starting the ride."});
    }
}

module.exports.endRide=async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const { rideId } = req.body;

    try{
        const ride = await rideservice.endRide(rideId, req.captain._id);
        const userSocket = await userModel.findById(ride.user._id).select('socketId');
        const socketId = userSocket?.socketId;
        if (socketId) {
            sendMessagetoSocketID(socketId,{
                event:'ride-ended',
                data:ride.toObject()
            });
        }
        res.json({message:"Ride ended successfully",ride});
    }
    catch(error){
        console.error("Error in endRide controller:", error.message || error);
        res.status(500).json({error:error.message || "An error occurred while ending the ride."});
    }
}

module.exports.completePayment=async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const { rideId } = req.body;

    try{
        const ride = await rideservice.completePayment(rideId, req.user._id);
        const captainSocket = await rideModel.findById(ride._id)
            .populate('captain')
            .then((doc) => doc?.captain?.socketId);
        if (captainSocket) {
            sendMessagetoSocketID(captainSocket,{
                event:'payment-completed',
                data:ride.toObject()
            });
        }
        res.json({message:"Payment completed successfully",ride});
    }
    catch(error){
        console.error("Error in completePayment controller:", error.message || error);
        res.status(500).json({error:error.message || "An error occurred while completing payment."});
    }
}