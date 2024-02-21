// user controller

import { User } from '../models/userModel.js';
import { sendCookie } from '../utils/sendCookie.js';
import { sendEmail } from '../utils/sendEmail.js';
import { sendResponse } from '../utils/sendResponse.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
            sendResponse({ res, code: 400, success: false, error: 'User already exists' });
        } else {
            //password encription 
            const encriptedPassword = await bcrypt.hash(password, 10)
            // Creating new user
            const user = await User.create({ name, email, password: encriptedPassword });
            const resetOTP = user.getMailVerifyOTP();
            const message = `Your Mail verification OTP is :- \n\n ${resetOTP} \n\nIf you have not requested this email then, please ignore it.`;
            try {
                await sendEmail({
                    email: email,
                    subject: `LogicLords: Emil verify OTP : ${resetOTP}`,
                    message,
                });
                user.verifyEmailOTP = resetOTP;
                user.verifyEmailOTPExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
                await user.save({ validateBeforeSave: false });

            } catch (error) {
                user.verifyEmailOTP = undefined;
                user.verifyEmailOTPExpire = undefined;
                await user.save({ validateBeforeSave: false });
                sendResponse({ res, code: 400, success: false, error: error.message });
            }
            sendCookie(user, res, 200);
        }
    } catch (error) {
        sendResponse({ res, code: 400, success: false, error: error.message });
    }
}

// verify email verifying otp
export const veryfyEmailOTP = async (req, res) => {
    try {
        const { otp, email } = req.body;
        let user = await User.findOne({ email: email });

        if (!user) {
            sendResponse({ res, code: 400, success: false, message: "Reset Password OTP is invalid or has been expired" });
        }
        const isMatched = user.verifyEmailPasswordOTP(otp)

        if (isMatched) {
            user.isEmailVerified = true;
            await user.save({ validateBeforeSave: false });
            user = await User.findOne({
                email
            });
            sendResponse({ res, code: 200, success: true, user, message: "Reset Password OTP is invalid or has been expired" });
        }
        else {
            sendResponse({ res, code: 400, success: false, message: "Reset Password OTP is invalid or has been expired" });
        }
    } catch (error) {
        sendResponse({ res, code: 400, success: false, message: error.message });
    }
}