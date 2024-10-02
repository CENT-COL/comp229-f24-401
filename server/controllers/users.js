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

        res.status(200).json({message: "User logged in successfully", token});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}