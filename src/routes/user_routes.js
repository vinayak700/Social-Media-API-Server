import express from 'express';
import { upload } from '../middlewares/fileupload.js';
import UserController from '../controllers/user_controller.js';

const userRouter = express.Router();

const userController = new UserController();

// Creating User Auth Routes
userRouter.get('/get-details/:userId', userController.getUser);
userRouter.get('/get-all-details', userController.getAllUsers)
userRouter.put('/update-details/:userId', upload.single('avatar'), userController.updateUser);
userRouter.delete('/delete/:userId', userController.deleteUser);

export default userRouter;