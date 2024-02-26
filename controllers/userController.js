// user controller
import { User } from '../models/userModel.js';
import { sendCookie } from '../utils/sendCookie.js';
import { sendEmail } from '../utils/sendEmail.js';
import { sendResponse } from '../utils/sendResponse.js';
import bcrypt from 'bcryptjs';


export const userInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        res.status(200).json({ success: true, user });
        // sendResponse({ res, code: 200, success: true, user });
    } catch (error) {
        sendResponse({ res, code: 400, success: false, message: 'User not available' });
    }
}

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
                console.log(user);

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
        let user = await User.findOne({ email: email }).select("+verifyEmailOTP");

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
            console.log(user);
            sendResponse({ res, code: 200, success: true, user, message: "Reset Password OTP is invalid or has been expired" });
        }
        else {
            sendResponse({ res, code: 400, success: false, message: "Reset Password OTP is invalid or has been expired" });
        }
    } catch (error) {
        sendResponse({ res, code: 400, success: false, message: error.message });
    }
}


///log in controller......

export const LoginUser = async (req, res) => {
    try {

        const { email, password } = req.body
        console.log(email, password);

        // checking if user has given password and email both


        const user = await User.findOne({ email }).select("+password");
        console.log(user);
        if (!user) {
            return res.status(400)
                .json({
                    success: false,
                    message: "Invalid email or password"
                })
        }

        const isPasswordMatched = await user.comparePassword(password);
        console.log(isPasswordMatched);
        if (!isPasswordMatched) {
            return res.status(400)
                .json({
                    success: false,
                    message: "Invalid email or password"
                })
        }

        // successful login
        sendCookie(user, res, 200)
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// export const googleSignup = async (req, res) => {
//     try {
//         const { email, name, avatar } = req.body
//         let user = await User.findOne({ email: email });

//         if (user) {
//             console.log("User exists");
//             sendCookie(user, res, 200);
//         } else {
//             let user = await User.create({
//                 name,
//                 email,
//                 googleAvatar: avatar,
//                 isEmailVerified: true,
//                 isGoogleLogin: true
//             });
//             console.log("userCreated", user);

//             sendCookie(user, res, 200);
//         }
//     } catch (error) {
//         sendResponse({ res, code: 400, success: false, error: error.message });
//     }
// }


export const logOutUser = async (req, res) => {
    try {
      res
        .status(200)
        .cookie("token", null, {
          expiresIn: new Date(
            Date.now()
          ),
          httpOnly: true,
          sameSite: "None",
          secure: true
        }).json({
          success: true,
          message: "user Logout successfully.."
        })
  
    } catch (error) {
  
      res.status(400).json({
        success: false,
        message: "logout faild...",
        error
      })
  
    }
  }
  
