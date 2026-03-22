const express=require('express');
const router=express.Router();
//express-validator is used to validate the data coming from the client side from frontend
const {body}=require('express-validator');
const userController=require('../controllers/user.controllers');
const authMiddleware=require('../middleware/auth.middleware');


//validating the data coming from the client side using express-validator and then calling the register function from userController to register the user in the database. We are validating the name.firstname, email and password fields and if any of the validation fails then we are sending the error message to the client side. If all the validation passes then we are calling the register function from userController to register the user in the database.
router.post('/register',[body('name.firstname').isLength({min:3}).withMessage("firstname should be at least 3 characters long"),
body('email').isEmail().withMessage("Please enter a valid email address"),
body('password').isLength({min:6}).withMessage("Password should be at least 6 characters long")],userController.register);

//login route is used to login the user and it takes the email and password from the client side and validates them using express-validator. If the validation fails then it sends the error message to the client side. If the validation passes then it calls the login function from userController to login the user in the database.
router.post('/login',[body('email').isEmail().withMessage("Not a valid email address"),
    body('password').isLength({min:6}).withMessage("Password should be at least 6 characters long")],userController.login);


router.get('/profile',authMiddleware.authUser,userController.getUserProfile);
router.get('/logout',authMiddleware.authUser,userController.logout);

module.exports=router;