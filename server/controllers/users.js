const otplib = require('otplib');
const qrcode = require('qrcode');

const User = require('../models/users');
const generateToken = require('../utils/jwt');


// Register a new user
exports.registerUser = async(req, res) => {
    try {
        const { username, email, password } = req.body; 
        const user = new User({username, email, password});
        await user.save();

        const token = generateToken(user);

        res.status(201).json({message: "User registered successfully", token});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// Login a user
exports.loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = generateToken(user);

        res.status(200).json({message: "User logged in successfully", token, username: user.username, is2FAEnabled: user.is2FAEnabled});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// Set Up 2FA
exports.setup2FA = async (req, res) => {
    const { email } = req.body;

    const secret = otplib.authenticator.generateSecret();

    const otpauth = otplib.authenticator.keyuri(email, 'COMP229 - SEC401 - OTP', secret);

    qrcode.toDataURL(otpauth, async (err, imageUrl) => {
        if(err){
            return res.status(500).json({message: 'Error Generating the QR CODE', err});
        }

        try {
            const user =  await User.findOneAndUpdate({email}, {otpSecret: secret});
            if(!user){
                return res.status(404).json({message: 'User not found'});
            }

            res.status(200).json({message: '2FA setup successful', imageUrl});

        } catch (error) {
            res.status(500).json({message: 'Error storing the secret', error});
        }
    })
}

// Verify 2FA
exports.verify2FASetup = async (req, res) => {
    const { email, token} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.status(404).json({message: 'User not found'});
    }

    const secret = user.otpSecret;

    if(!secret){
        return res.status(400).json({message: '2FA not enabled'});
    }

    const isValid = otplib.authenticator.check(token, secret);

    if(isValid){
        user.is2FAEnabled = true;
        await user.save();
        return res.status(200).json({message: '2FA enabled successfully'});
    }  else {
        res.status(400).json({message: 'Invalid token'});
    }
}

exports.verifyOTP = async (req, res) => {
    const {email, token} = req.body;

    const user = await User.findOne({email});   

    if(!user){
        return res.status(404).json({message: 'User not found'});
    }

    const secret = user.otpSecret;

    if(!secret){
        return res.status(400).json({message: '2FA not enabled'});
    }

    const isValid = otplib.authenticator.check(token, secret);

    if(isValid){

        const jwtToken = generateToken(user);

        return res.status(200).json({
            message: 'OTP verified successfully',
            _id: user._id,
            username: user.username,
            email: user.email,
            token: jwtToken
        });
         
    } else {
        return res.status(400).json({message: 'Invalid token'});
    }
}