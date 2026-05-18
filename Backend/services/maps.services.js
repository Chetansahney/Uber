const axios = require("axios");
const captainModel = require('../models/captain.models');
module.exports.getLocationCoordinates = async (address) => {
	if (!address || typeof address !== "string") {
		throw new Error("Address is required.");
	}

	const apiKey = process.env.GOOGLE_MAPS_API;
	if (!apiKey) {
		throw new Error("GOOGLE_MAPS_API is not set.");
	}

	const url = "https://maps.googleapis.com/maps/api/geocode/json";

	const response = await axios.get(url, {
		params: {
			address: address.trim(),
			key: apiKey,
		},
	});

	const data = response.data;
	if (!data || data.status !== "OK" || !Array.isArray(data.results) || data.results.length === 0) {
		const status = data && data.status ? data.status : "UNKNOWN_ERROR";
		throw new Error(`Unable to geocode address. Status: ${status}`);
	}

	const location = data.results[0].geometry.location;
	return {
		latitude: location.lat,
		longitude: location.lng,
	};
};
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required.");
    }
    const apiKey = process.env.GOOGLE_MAPS_API;
    if (!apiKey) {
        throw new Error("GOOGLE_MAPS_API is not set.");
    }
    const url = "https://maps.googleapis.com/maps/api/distancematrix/json";
    const response = await axios.get(url, {
        params: {
            origins: origin.trim(),
            destinations: destination.trim(),
            key: apiKey,
        },
    });
    const data = response.data;
    if (!data || data.status !== "OK" || !Array.isArray(data.rows) || data.rows.length === 0) {
        const status = data && data.status ? data.status : "UNKNOWN_ERROR";
        throw new Error(`Unable to calculate distance and time. Status: ${status}`);
    }
    const element = data.rows[0].elements[0];
    if (element.status !== "OK") {
        throw new Error(`Unable to calculate distance and time. Element status: ${element.status}`);
    }
    return {
        distance: element.distance.text,
        duration: element.duration.text,
    };
}
module.exports.getSuggestions = async (input) => {
    if (!input || typeof input !== "string") {
        throw new Error("Input is required.");
    }
    const apiKey = process.env.GOOGLE_MAPS_API; 
    if (!apiKey) {
        throw new Error("GOOGLE_MAPS_API is not set.");
    }
    const url = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
    const response = await axios.get(url, {
        params: {   
            input: input.trim(),
            key: apiKey,
        },  
    });
    const data = response.data;
    if (!data || data.status !== "OK" || !Array.isArray(data.predictions)) {
        const status = data && data.status ? data.status : "UNKNOWN_ERROR";
        throw new Error(`Unable to fetch suggestions. Status: ${status}`);
    }
    return data.predictions.map(prediction => ({
        description: prediction.description,
        place_id: prediction.place_id,
    }));
}


module.exports.getCaptainsNearby = async (latitude, longitude, radius) => {
    console.log('Searching near:', longitude, latitude, 'radius:', radius);
    
    // Check ALL captains and their locations
    const allCaptains = await captainModel.find({});
    console.log('Total captains:', allCaptains.length);
    allCaptains.forEach(c => {
        console.log('Captain:', c.email, 'Location:', JSON.stringify(c.location));
    });

    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[longitude, latitude], radius / 6371]
            }
        }
    });
    console.log('Nearby found:', captains.length);
    return captains;
};
