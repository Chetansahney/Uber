const { Server } = require("socket.io");
const userModel = require("./models/user.models");
const captainModel = require("./models/captain.models");
const rideModel = require("./models/ride.model");


let io;

const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("New connection:", socket.id);

        socket.on("join", async (data) => {
            const { userId, userType } = data;
            console.log(`User ${userId} of type ${userType} joined with socket ID ${socket.id}`);

            try {
                if (userType === "user") {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                } else if (userType === "captain") {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                }
            } catch (err) {
                console.error("Error saving socketId:", err);
            }
        });

        // Captain sends their live location
        socket.on("update-location-captain", async (data) => {
            console.log('Location received from captain:', data);
            const { userId, location, rideId } = data || {};
            if (!userId || !location || location.lat == null || location.lng == null) {
                console.warn('Invalid location payload from captain');
                return;
            }

            try {
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        type: 'Point',
                        coordinates: [location.lng, location.lat],
                    },
                    status: 'available',
                });
                console.log('Location saved to DB ✅');

                if (rideId) {
                    const ride = await rideModel.findById(rideId).populate('user');
                    const userSocketId = ride?.user?.socketId;
                    if (userSocketId) {
                        io.to(userSocketId).emit('captain-location', {
                            rideId,
                            location: {
                                lat: location.lat,
                                lng: location.lng,
                            },
                        });
                    }
                }
            } catch (err) {
                console.error("Error updating location:", err);
            }
        });

        socket.on("disconnect", () => {
            console.log("Disconnected:", socket.id);
        });
    });

    return io;
};

const sendMessagetoSocketID = (socketId, messageObject) => {

console.log('Emitting to socketId:', socketId, 'event:', messageObject?.event);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessagetoSocketID };