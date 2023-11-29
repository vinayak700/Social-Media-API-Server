import { ObjectId } from "mongodb";
import { ApplicationError } from "../../utils/error.js";
import User from "../models/user_schema.js";

export default class UserController {
    // Retrieve all users
    getAllUsers = async (req, res) => {
        try {
            // Get all users from the database, excluding tokens and password fields
            const users = await User.find().select({ tokens: 0, password: 0 });
            // Check if any users are found
            if (users.length > 0) {
                return res.status(200).json(users);
            }
            // If no users are found, send a 404 response
            return res.status(404).json({ error: 'No users found.' });
        } catch (error) {
            console.error(error);
            // If an error occurs during user retrieval, throw a custom application error
            throw new ApplicationError(500, 'Failed to retrieve users. Please try again later.');
        }
    }

    // Get a specific user by userId
    getUser = async (req, res) => {
        const { userId } = req.params;
        try {
            // Find a user by their ID, excluding tokens and password fields
            const user = await User.findById(userId).select({ tokens: 0, password: 0 });
            // Check if the user is found
            if (user) {
                return res.status(200).json(user);
            }
            // If the user is not found, send a 404 response
            return res.status(404).json({ error: 'User not found.' });
        } catch (error) {
            console.error(error);
            // If an error occurs during user retrieval, throw a custom application error
            throw new ApplicationError(500, 'Failed to retrieve user. Please try again later.');
        }
    }

    // Update a specific user by userId
    updateUser = async (req, res) => {
        const { userId } = req.params;
        const { name, email, gender } = req.body;
        const avatar = req.file ? req.file.filename : req.body.avatar;
        try {
            // Find the user by ID
            const user = await User.findById(userId);
            // Update the user with the provided data
            const updatedUser = await User.findOneAndUpdate(
                { _id: new ObjectId(userId) },
                {
                    $set: {
                        name: name || user.name,
                        email: email || user.email,
                        gender: gender || user.gender,
                        avatar: avatar || user.avatar
                    },
                },
                { returnDocument: 'after' }
            );
            // Check if the user is updated successfully
            if (updatedUser) {
                return res.status(200).json({ message: 'User updated successfully.' });
            }
            // If the user update fails, send a 400 response
            return res.status(400).json({ error: 'Failed to update the user.' });
        } catch (error) {
            console.error(error);
            // If an error occurs during user update, throw a custom application error
            throw new ApplicationError(500, 'Failed to update user. Please try again later.');
        }
    }

    // Delete a specific user by userId
    deleteUser = async (req, res) => {
        const { userId } = req.params;
        try {
            // Delete the user by ID
            const user = await User.deleteOne({ _id: new ObjectId(userId) });
            // Check if the user is deleted successfully
            if (user.deletedCount > 0) {
                return res.status(200).json({ message: 'User has been deleted.' });
            }
            // If the user deletion fails, send a 400 response
            return res.status(400).json({ error: 'Invalid user.' });
        } catch (error) {
            console.error(error);
            // If an error occurs during user deletion, throw a custom application error
            throw new ApplicationError(500, 'Failed to delete user. Please try again later.');
        }
    }
}
