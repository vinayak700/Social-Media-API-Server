import express from 'express';
import LikeController from '../controllers/like_controller.js';

const likeRouter = express.Router();
const likeController = new LikeController();

// Like Routes
likeRouter.get('/:id', likeController.getLikes);
likeRouter.post('/toggle/:id', likeController.toggleLike);

export default likeRouter;