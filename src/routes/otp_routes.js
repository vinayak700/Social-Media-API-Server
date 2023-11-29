import express from 'express';
import OtpController from '../controllers/otp_controller.js';

const otpRouter = express.Router();
const otpController = new OtpController();

// Like Routes
otpRouter.post('/send', otpController.sendOtp);
otpRouter.post('/verify', otpController.verifyOTP);
otpRouter.post('/reset-password', otpController.resetPassword);

export default otpRouter;