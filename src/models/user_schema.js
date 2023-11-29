import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    avatar: {
        type: String,
    },
    tokens: [
        { type: String }
    ],
    otp: Number,
    otpExpire: Date,
}, { timestamps: true, versionKey: false });

const User = mongoose.model('User', userSchema);
export default User;