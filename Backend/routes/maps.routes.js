const express = require('express');
const router = express.Router();
const mapsService = require('../services/maps.services');
const {getcoordinates} = require('../controllers/map.controller');
const authMiddleware = require('../middleware/auth.middleware');
const mapController = require('../controllers/map.controller');
const {query} = require('express-validator');
const { map } = require('../app');


router.get('/get-coordinates',
    query('address').not().isEmpty().withMessage('Address is required'),
    authMiddleware.authUser,
    getcoordinates
);
router.get('/get-distance-time',
    query('origin').not().isEmpty().withMessage('Origin is required'),
    query('destination').not().isEmpty().withMessage('Destination is required'),
    authMiddleware.authUser,
    mapController.getDistanceTime
);
router.get('/get-suggestions',
    query('input').not().isEmpty().withMessage('Input is required'),
    authMiddleware.authUser,
    mapController.getSuggestions
);

module.exports = router;