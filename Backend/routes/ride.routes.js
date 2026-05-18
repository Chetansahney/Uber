const express=require('express');
const router=express.Router();
const {body,query}=require('express-validator');
const rideController=require('../controllers/ride.controller');
const authMiddleware=require('../middleware/auth.middleware');

router.post('/create',
    (req, res, next) => {
        console.log('POST /rides/create hit', { body: req.body });
        next();
    },
    authMiddleware.authUser,
    body('origin').not().isEmpty().withMessage('Origin is required'),
    body('destination').not().isEmpty().withMessage('Destination is required'),
    body('vehicleType').not().isEmpty().withMessage('Vehicle type is required'),
    rideController.createRide
)

router.get('/calculate-fare',
    authMiddleware.authUser,
    query('origin').not().isEmpty().withMessage('Origin is required'),
    query('destination').not().isEmpty().withMessage('Destination is required'),
    rideController.calculateFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').not().isEmpty().withMessage('Ride ID is required'),
    rideController.confirmRide
)

router.post('/start-ride',
    authMiddleware.authCaptain,
    body('rideId').not().isEmpty().withMessage('Ride ID is required'),
    body('otp').not().isEmpty().withMessage('OTP is required'),
    rideController.startRide
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').not().isEmpty().withMessage('Ride ID is required'),
    rideController.endRide
)

router.post('/complete-payment',
    authMiddleware.authUser,
    body('rideId').not().isEmpty().withMessage('Ride ID is required'),
    rideController.completePayment
)

router.get('/:rideId',
    authMiddleware.authUser,
    rideController.getRideById
)



module.exports=router;