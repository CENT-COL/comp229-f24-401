const express = require('express');
const router = express.Router();   
const userController = require('../controllers/users');

// Register a new user
router.post('/register', userController.registerUser);

// Login an existing user
router.post('/login', userController.loginUser);

// Set up 2FA
router.post('/setup2FA', userController.setup2FA);
router.post('/verify2FA', userController.verify2FASetup);
router.post('/verifyOTP', userController.verifyOTP);

module.exports = router;