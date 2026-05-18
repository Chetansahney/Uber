const mapservice = require('../services/maps.services');
const { validationResult } = require('express-validator');

module.exports.getcoordinates = async (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { address } = req.query;

    try {   
        if (!address) {
            return res.status(400).json({ error: "Address query parameter is required." });
        }
        const coordinates = await mapservice.getLocationCoordinates(address);
        res.json(coordinates);
    }
    catch (error) {
        console.error("Error in getcoordinates controller:", error);
        res.status(500).json({ error: "An error occurred while fetching coordinates." });
    }

}

module.exports.getDistanceTime = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { origin, destination } = req.query;

    try {
        if (!origin || !destination) {
            return res.status(400).json({ error: "Origin and destination query parameters are required." });
        }
        const result = await mapservice.getDistanceTime(origin, destination);
        res.json(result);
    }
    catch (error) {
        console.error("Error in getDistanceTime controller:", error);
        res.status(500).json({ error: "An error occurred while fetching distance and time." });
    }
}

module.exports.getSuggestions = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { input } = req.query;
    try {
        if (!input) {
            return res.status(400).json({ error: "Input query parameter is required." });
        }
        const suggestions = await mapservice.getSuggestions(input);
        res.json(suggestions);
    }
    catch (error) {
        console.error("Error in getSuggestions controller:", error);
        res.status(500).json({ error: "An error occurred while fetching suggestions." });
    }
}