import sendMail from "../../config/mailer.js";
import { ApplicationError } from "../../utils/error.js";
import User from "../models/user_schema.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export default class OtpController {
    // Sending an OTP to the client to reset the password
    sendOtp = async (req, res, next) => {
        const { email } = req.body;
        try {
            // Check if form data is present
            if (!email)
                return next(new ApplicationError(400, "Email address is required."));

            // Verify user with the given email address
            const user = await User.findOne({ email: email });
            if (!user) {
                return next(
                    new ApplicationError(
                        400,
                        "No user found associated with this email address."
                    )
                );
            }

            // Generate OTP and set its expiration time
            const otp = Math.floor(10000 + Math.random() * 90000);
            const otpExpire = new Date();
            otpExpire.setMinutes(otpExpire.getMinutes() + 1);

            // Update user with OTP and its expiration time
            await User.updateOne(
                { email: email },
                { $set: { otp: otp, otpExpire: otpExpire } }
            );

            // Send OTP to the user's email address
            sendMail(email, otp);

            return res
                .status(200)
                .json({ data: "OTP has been sent to your email address" });
        } catch (error) {
            console.log(error);
            next(new ApplicationError(500, error));
        }
    };

    // Verify OTP for password reset
    verifyOTP = async (req, res, next) => {
        const { otp, email } = req.body;
        try {
            // Find user with the given email address
            const user = await User.findOne({ email: email });

            // Check if the OTP is valid and not expired
            if (!(user && user.otp === otp && user.otpExpire > new Date())) {
                await User.updateOne(
                    { email: email },
                    { $set: { otp: null, otpExpire: null } }
                );
                return next(new ApplicationError(400, "Invalid or expired OTP"));
            }

            // Set up user cookie
            res.cookie("userId", user._id, {
                maxAge: 10 * 1000,
            });

            // Clear OTP and its expiration after successful verification
            await User.updateOne(
                { email: email },
                { $set: { otp: null, otpExpire: null } }
            );

            return res.status(200).json({ data: "OTP verification successful" });
        } catch (error) {
            console.log(error);
            return next(new ApplicationError(500, error));
        }
    };

    // Reset the user password
    resetPassword = async (req, res, next) => {
        const id = req.cookies.userId;
        const { password, confirmPassword } = req.body;
        console.log(id, password);
        try {
            // Check if form data is present
            if (!password || !confirmPassword)
                return next(new ApplicationError(400, "Passwords are required."));

            // Validate that the password and confirmPassword match
            if (password !== confirmPassword) {
                return next(new ApplicationError(400, "Passwords do not match"));
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update the user password
            const user = await User.updateOne(
                { _id: new ObjectId(id) },
                { $set: { password: hashedPassword } }
            );

            // Check if the update was successful
            if (!user) {
                return next(new ApplicationError(400, "OTP Session Expired."));
            }
            return res.status(200).json({
                data: "Password reset successful",
            });
        } catch (error) {
            console.log(error);
            return next(new ApplicationError(500, error));
        }
    };
}
