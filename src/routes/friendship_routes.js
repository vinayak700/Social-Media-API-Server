import express from 'express';
import FriendshipController from '../controllers/friendship_Controller.js';

const friendshipRouter = express.Router();
const friendshipController = new FriendshipController();

// Friendship Routes
friendshipRouter.get('/get-friends', friendshipController.getFriends);
friendshipRouter.get('/get-pending-requests', friendshipController.getPendingRequests);
friendshipRouter.get('/toggle-friendship/:friendId', friendshipController.toggleFriendship);
friendshipRouter.post('/response-to-request/:friendId', friendshipController.respondToRequest);

export default friendshipRouter;