import express from 'express';
import AuthController from '../controllers/auth_controller.js';
import { upload } from '../middlewares/fileupload.js';
import auth from '../middlewares/auth.js';

const authRouter = express.Router();

const authController = new AuthController();

// Creating User Auth Routes
authRouter.post('/signup', upload.single('avatar'), authController.register);
authRouter.post('/signin', authController.login);
authRouter.get('/logout', auth, authController.logout);
authRouter.get('/logout-all-devices', auth, authController.logoutAll);

export default authRouter;