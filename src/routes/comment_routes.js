import express from 'express';
import CommentController from '../controllers/comment_controller.js';

// Instantiation
const commentRouter = express.Router();
const commentController = new CommentController();

// Comment Routes
commentRouter.post('/:postId', commentController.createComment);
commentRouter.get('/:postId', commentController.getPostComments);
commentRouter.put('/:commentId', commentController.updateComment);
commentRouter.delete('/:commentId', commentController.deleteComment);

export default commentRouter;