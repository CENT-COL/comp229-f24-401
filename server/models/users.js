const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: true,
    }, 
    otpSecret: {
        type: String,
        default: null
    },
    is2FAEnabled: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function(next){
    if(this.isModified('password') || this.isNew){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next(); //continue with the saving
 });

 userSchema.methods.comparePassword =  async function(password) {
    return await bcrypt.compare(password, this.password);
 };

 module.exports = mongoose.model('User', userSchema);

