const ridemodel = require('../models/ride.model');
const mapsService = require('../services/maps.services');
const bcrypt = require("bcrypt");
const crypto = require("crypto");

async function getOTP(num = 4) {
    const length = Number.isInteger(num) && num > 0 ? num : 4;
    let otp = "";
    for (let i = 0; i < length; i += 1) {
        otp += crypto.randomInt(0, 10).toString();
    }
    const hash = await bcrypt.hash(otp, 10);
    return { otp, hash };
}

// ✅ moved outside — top level functions
function parseDistanceKm(distanceText) {
    const text = String(distanceText).toLowerCase().trim();
    if (text.includes("km")) {
        const value = parseFloat(text.replace(/[^0-9.]/g, ""));
        if (Number.isNaN(value)) throw new Error("Invalid distance value.");
        return value;
    }
    if (text.includes("m")) {
        const value = parseFloat(text.replace(/[^0-9.]/g, ""));
        if (Number.isNaN(value)) throw new Error("Invalid distance value.");
        return value / 1000;
    }
    throw new Error("Unsupported distance format.");
}

function parseDurationMin(durationText) {
    const text = String(durationText).toLowerCase().trim();
    const hourMatch = text.match(/(\d+(?:\.\d+)?)\s*hour/);
    const minMatch = text.match(/(\d+(?:\.\d+)?)\s*min/);
    const hours = hourMatch ? parseFloat(hourMatch[1]) : 0;
    const mins = minMatch ? parseFloat(minMatch[1]) : 0;
    const total = hours * 60 + mins;
    if (Number.isNaN(total) || total <= 0) throw new Error("Invalid duration value.");
    return total;
}

// ✅ defined as a local function AND exported
async function calculateFare(origin, destination) {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required to calculate fare.");
    }
    const distTime = await mapsService.getDistanceTime(origin, destination);
    if (!distTime || !distTime.distance || !distTime.duration) {
        throw new Error("Distance and duration are required to calculate fare.");
    }

    const distanceKm = parseDistanceKm(distTime.distance);
    const durationMin = parseDurationMin(distTime.duration);

    const rates = {
        moto: { base: 20, perKm: 8, perMin: 1 },
        auto: { base: 30, perKm: 12, perMin: 1.5 },
        car: { base: 50, perKm: 18, perMin: 2 },
    };

    return {
        moto: Math.round(rates.moto.base + distanceKm * rates.moto.perKm + durationMin * rates.moto.perMin),
        auto: Math.round(rates.auto.base + distanceKm * rates.auto.perKm + durationMin * rates.auto.perMin),
        car: Math.round(rates.car.base + distanceKm * rates.car.perKm + durationMin * rates.car.perMin),
    };
}

module.exports.calculateFare = calculateFare; // ✅ exported

module.exports.createRide = async ({ user, origin, destination, vehicleType }) => {
    if (!user || !origin || !destination || !vehicleType) {
        throw new Error("User, origin, destination, and vehicle type are required.");
    }
    const { otp, hash } = await getOTP();
    const fare = await calculateFare(origin, destination); // ✅ works now — local function
    
    const ride = new ridemodel({
        user,
        origin,
        destination,
        otp: hash,
        fare: fare[vehicleType] || fare.car,
    });
    await ride.save();
    return { ride, otp };
}

module.exports.confirmRide = async (rideId, captainId) => {
    if (!rideId || !captainId) {
        throw new Error("Ride ID and captain ID are required to confirm ride.");
    }

    const ride = await ridemodel
        .findByIdAndUpdate(
            rideId,
            { captain: captainId, status: 'accepted' },
            { new: true }
        )
        .populate("user")
        .populate("captain");

    if (!ride) {
        throw new Error("Ride not found.");
    }

    return ride;
};

module.exports.startRide = async (rideId, captainId, otp) => {
    const otpValue = String(otp || '').trim();
    if (!rideId || !captainId || !otpValue) {
        throw new Error("Ride ID, captain ID, and OTP are required to start ride.");
    }

    const ride = await ridemodel
        .findOne({ _id: rideId })
        .select('+otp')
        .populate("user")
        .populate("captain");

    if (!ride) {
        throw new Error("Ride not found.");
    }

    if (!ride.captain || ride.captain._id.toString() !== captainId.toString()) {
        throw new Error("Captain not authorized for this ride.");
    }

    const isMatch = await bcrypt.compare(otpValue, ride.otp);
    if (!isMatch) {
        throw new Error("Invalid OTP.");
    }

    ride.status = 'ongoing';
    await ride.save();

    const updatedRide = await ridemodel
        .findById(rideId)
        .populate("user")
        .populate("captain");

    return updatedRide;
};

module.exports.endRide = async (rideId, captainId) => {
    if (!rideId || !captainId) {
        throw new Error("Ride ID and captain ID are required to end ride.");
    }

    const ride = await ridemodel
        .findOne({ _id: rideId })
        .populate("user")
        .populate("captain");

    if (!ride) {
        throw new Error("Ride not found.");
    }

    if (!ride.captain || ride.captain._id.toString() !== captainId.toString()) {
        throw new Error("Captain not authorized for this ride.");
    }

    ride.status = 'completed';
    await ride.save();

    const updatedRide = await ridemodel
        .findById(rideId)
        .populate("user")
        .populate("captain");

    return updatedRide;
};

module.exports.completePayment = async (rideId, userId) => {
    if (!rideId || !userId) {
        throw new Error("Ride ID and user ID are required to complete payment.");
    }

    const ride = await ridemodel
        .findOne({ _id: rideId })
        .populate("user")
        .populate("captain");

    if (!ride) {
        throw new Error("Ride not found.");
    }

    if (!ride.user || ride.user._id.toString() !== userId.toString()) {
        throw new Error("User not authorized for this ride.");
    }

    ride.paymentStatus = 'paid';
    await ride.save();

    const updatedRide = await ridemodel
        .findById(rideId)
        .populate("user")
        .populate("captain");

    return updatedRide;
};