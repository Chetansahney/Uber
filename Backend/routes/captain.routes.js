const express=require('express');
const router=express.Router();
const captainController=require('../controllers/captain.controller');
const {body}=require('express-validator');
const authMiddleware=require('../middleware/auth.middleware');

router.post('/register',[body('name').isLength({min:3}).withMessage("Name should be at least 3 characters long"),
body('email').isEmail().withMessage("Please enter a valid email address"),
body('password').isLength({min:6}).withMessage("Password should be at least 6 characters long"),body('vehicle.color').notEmpty().withMessage("Vehicle color is required"),
body('vehicle.model').notEmpty().withMessage("Vehicle model is required"),
body('vehicle.plate').notEmpty().withMessage("Vehicle plate is required"),
body('vehicle.capacity').isInt({min:1}).withMessage("Vehicle capacity must be at least 1"),
body('vehicle.vehicleType').isIn(["car","bike","auto"]).withMessage("Vehicle type must be either car, bike or auto")],captainController.register);


router.post('/login',[body('email').isEmail().withMessage("Please enter a valid email address"),
body('password').isLength({min:6}).withMessage("Password should be at least 6 characters long")],captainController.loginCaptain);


router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile);

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);


module.exports=router;