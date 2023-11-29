import { ObjectId } from "mongodb";
import Friendship from "../models/friendship_schema.js";
import { ApplicationError } from "../../utils/error.js";

export default class FriendshipController {
    // Retrieve friends of a user
    getFriends = async (req, res, next) => {
        const userId = req.userId;
        try {
            const friends = await Friendship.find({
                user: new ObjectId(userId),
                status: "accepted",
            }).populate({
                path: "user",
                select: "-password -tokens -createdAt -updatedAt",
            });

            // If friends are found, return them; otherwise, return a 404 response
            if (friends.length > 0) {
                return res.status(200).send(friends);
            }
            return res.status(404).send("No friends found.");
        } catch (error) {
            console.log(error);
            // If an error occurs, throw a custom application error
            next(new ApplicationError(500, "Something went wrong"));
        }
    };

    // Retrieve pending friend requests across all users
    getPendingRequests = async (req, res, next) => {
        try {
            const requests = await Friendship.find({ status: "pending" }).populate({
                path: "user",
                select: "-password -tokens -createdAt -updatedAt",
            });

            // If pending requests are found, return them; otherwise, return a 404 response
            if (requests.length > 0) {
                return res.status(200).send(requests);
            }
            return res.status(404).send("No Pending Requests found.");
        } catch (error) {
            console.log(error);
            // If an error occurs, throw a custom application error
            next(new ApplicationError(500, "Something went wrong"));
        }
    };

    // Toggle friendship status (send/revoke friend request)
    toggleFriendship = async (req, res, next) => {
        const userId = req.userId;
        const friendId = req.params.friendId;
        try {
            // Check if there is an existing friendship
            const existingFriendship = await Friendship.findOne({
                user: new ObjectId(userId),
                friend: new ObjectId(friendId),
            }).populate({
                path: "user",
                select: "-password -tokens -createdAt -updatedAt",
            });

            // Toggle the friendship status based on its current state
            if (existingFriendship) {
                existingFriendship.status =
                    existingFriendship.status === "accepted" ? "pending" : "accepted";
                await existingFriendship.save();
                return res.status(200).send("Friendship toggled successfully");
            } else {
                // Create a new friendship if it doesn't exist
                const newFriendship = new Friendship({
                    user: new ObjectId(userId),
                    friend: new ObjectId(friendId),
                    status: "pending",
                });
                await newFriendship.save();
                return res.status(201).json("Friendship created successfully.");
            }
        } catch (error) {
            console.error(error);
            // If an error occurs, throw a custom application error
            next(new ApplicationError(500, "Internal Server Error"));
        }
    };

    // Responding to friend request (accept/reject)
    respondToRequest = async (req, res, next) => {
        const userId = req.userId;
        const friendId = req.params.friendId;
        const response = req.body.response; // 'accept' or 'reject'
        try {
            // Find the friend request based on user IDs and status
            const friendRequest = await Friendship.findOne({
                user: new ObjectId(friendId),
                friend: new ObjectId(userId),
                status: "pending",
            });

            // Update the friend request status based on the user's response
            if (friendRequest) {
                friendRequest.status = response === "accept" ? "accepted" : "rejected";
                await friendRequest.save();

                // Return a response based on the accepted or rejected status
                if (friendRequest.status === "accepted") {
                    return res.status(200).send("You confirmed the friend request.");
                }
                if (friendRequest.status === "rejected") {
                    return res.status(200).send("You rejected the friend request.");
                }
            } else {
                // If no friend request is found, return a 404 response
                res
                    .status(404)
                    .json({ message: "You are already a friend with this user!" });
            }
        } catch (error) {
            console.error(error);
            // If an error occurs, throw a custom application error
            next(new ApplicationError(500, "Internal Server Error"));
        }
    };
}
