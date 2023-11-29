import { ApplicationError } from '../../utils/error.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user_schema.js";
import { ObjectId } from 'mongodb';

export default class AuthController {
    // Register a new user
    register = async (req, res) => {
        const { name, email, password, gender } = req.body;
        const avatar = req.file ? req.file.filename : req.body.avatar;
        try {
            // Hash the user's password before storing it
            const hashedPassword = await bcrypt.hash(password, 12);
            // Create a new user instance
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword,
                gender: gender,
                avatar: avatar,
            });
            // Save the user to the database
            await user.save();
            // Check if user registration was successful
            if (user) {
                return res.status(201).json({ message: 'User has been registered successfully.' });
            }
            // If registration failed, send an error response
            res.status(400).json({ error: 'Failed to register the user.' });
        } catch (error) {
            console.error(error);
            // If an error occurs during registration, throw a custom application error
            throw new ApplicationError(500, 'Failed to register the user. Please try again later.');
        }
    }

    // Log into the account
    login = async (req, res) => {
        const { email, password } = req.body;
        try {
            // Check if the user with the provided email exists
            const userExist = await User.findOne({ email });
            if (!userExist) {
                // If user not found, send a 404 error response
                return res.status(404).json({ error: 'User not found. Please check your credentials.' });
            } else {
                // Compare the provided password with the hashed password in the database
                const isPass = await bcrypt.compare(password, userExist.password);
                if (isPass) {
                    // If password is correct, generate a JWT token for authentication
                    const token = jwt.sign({ userId: userExist._id, email: userExist.email }, process.env.JWT_SECRET_KEY, {
                        algorithm: 'HS256',
                        expiresIn: '1h'
                    });
                    // Store the token in the user's tokens array
                    await User.updateOne(
                        { _id: new ObjectId(userExist._id) },
                        { $push: { tokens: token } }
                    );
                    // Send the token as a JSON response
                    return res.status(200).json({ token, message: 'Login successful.' });
                } else {
                    // If password is incorrect, send a 401 error response
                    return res.status(400).json({ error: 'Incorrect password. Please try again.' });
                }
            }
        } catch (error) {
            console.error(error);
            // If an error occurs during login, throw a custom application error
            throw new ApplicationError(500, 'Failed to log in. Please try again later.');
        }
    }

    // Logout from the current device
    logout = async (req, res) => {
        try {
            // Get the token from the authorization header and the user ID from the request Object
            const token = req.headers['authorization'];
            const userId = req.userId;
            if (token) {
                // Remove the token from the user's tokens array
                await User.updateOne(
                    { _id: new ObjectId(userId) },
                    { $pull: { tokens: token } }
                );
                // Send a JSON response indicating successful logout
                return res.status(200).json({ message: 'Logout successful. You have been logged out from the current device.' });
            }
            // If no token is provided, send a 401 error response
            res.status(401).json({ error: 'Unauthorized Request. No authorization header found.' });
        } catch (error) {
            console.error(error);
            // If an error occurs during logout, throw a custom application error
            throw new ApplicationError(500, 'Failed to logout. Please try again later.');
        }
    }

    // Logout from all devices
    logoutAll = async (req, res) => {
        try {
            // Get the token from the authorization header and the user ID from the request
            const token = req.headers['authorization'];
            const userId = req.userId;
            if (token) {
                // Remove all tokens from the user's tokens array
                await User.updateOne(
                    { _id: new ObjectId(userId) },
                    { $unset: { tokens: "" } }
                );
                // Send a JSON response indicating successful logout from all devices
                return res.status(200).json({ message: 'Logout successful. You have been logged out from all devices.' });
            }
            // If no token is provided, send a 401 error response
            res.status(401).json({ error: 'Bad Request. No authorization headers found.' });
        } catch (error) {
            console.error(error);
            // If an error occurs during logout from all devices, throw a custom application error
            throw new ApplicationError(500, 'Failed to logout from all devices. Please try again later.');
        }
    }

    // // Refresh access token (Needs implementation)
    // refreshToken = async (req, res) => {
    //     try {
    //         // Implement logic to generate a new access token here

    //     } catch (error) {
    //         console.error(error);
    //         // If an error occurs during refreshing the access token, throw a custom application error
    //         throw new ApplicationError(500, 'Failed to refresh access token. Please try again later.');
    //     }
    // }
}
