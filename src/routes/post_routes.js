import express from 'express';
import { upload } from '../middlewares/fileupload.js';
import PostController from '../controllers/post_controller.js';
import loggerMiddleware from '../middlewares/logger.js';

const postController = new PostController();

const postRouter = express.Router();

// Creating Post Routes
postRouter.post('/', upload.single('imageUrl'), loggerMiddleware, postController.createPost);
postRouter.get('/', postController.getUserPosts);
postRouter.get('/all', postController.getAllPosts);
postRouter.get('/filter', postController.filterPosts);
postRouter.get('/:postId', postController.getPost);
postRouter.put('/:postId', upload.single('imageUrl'), loggerMiddleware, postController.updatePost);
postRouter.delete('/:postId', postController.deletePost);
postRouter.get('/toggle/:postId', postController.toggleBookmark);
postRouter.patch('/archive/:postId', postController.archivePost);
postRouter.patch('/unarchive/:postId', postController.unarchivePost);

export default postRouter;