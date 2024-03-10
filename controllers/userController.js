import { User } from '../models/userModel.js';
import { sendCookie } from '../utils/sendCookie.js';

export const userInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, message: 'User not available' });
    }
}

export const registerUser = async (req, res, next) => {
    try {

        let { name, email, password } = req.body;
        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ success: false, message: 'user alrady exist...' });//if user exist , then return error


        // after email verification user will get 5 more coins
        user = await User.create({
            name,
            email,
            password,
            llCoins: 5
        })
        sendCookie(user, res, 200);
    }
    catch (err) {
        res.status(400).json({ success: false, message: 'Can not Register!' });
    }
}

export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" })
        }

        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(400).json({ success: false, message: "Invalid email or password" })
        }
        sendCookie(user, res, 200)
    } catch (error) {
        res.status(400).json({ success: false, message: 'Internal server error' });
    }
}

export const logOutUser = async (req, res) => {
    try {
        res.status(200)
            .cookie("token", "q", {
                expiresIn: new Date(
                    Date.now()
                ),
                httpOnly: true,
                sameSite: "None",
                secure: true,
              
            }).json({
                success: true,
                message: "user Logout successfully"
            })

    } catch (error) {
        res.status(400).json({ success: false, message: 'Logout Failed.' });
    }
}

// forgot password recive email from frontenda and send the otp
export const forgotPassword = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      // console.log(user);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      // otp method
      const resetOTP = user.getResetPasswordOTP();
  
      await user.save({ validateBeforeSave: false });
  
      const message = `Your password reset OTP is :- \n\n ${resetOTP} \n\nIf you have not requested this email then, please ignore it.`;
  
      try {
        await sendEmail({
          email: user.email,
          subject: `CloudGallery: forgot password OTP : ${resetOTP}`,
          message,
        });
  
        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email} successfully`,
        });
      } catch (error) {
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;
  
        await user.save({ validateBeforeSave: false });
  
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  
// get and verify the otp from frontend

export const veryfyOTP = async (req, res) => {

    try {
      const { resetPasswordOTP } = req.body;
  
      const user = await User.findOne({
        resetPasswordOTP,
      });
      // console.log(user);
      // console.log(user.verifyResetPasswordOTP(resetPasswordOTP));
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Reset Password OTP is invalid or has been expired",
        });
      }
      // console.log(user);
      if (user.verifyResetPasswordOTP(resetPasswordOTP)) {
        res.status(200).json({
          success: true
  
        });
      }
      else {
        res.status(400).json({
          success: false,
          message: error.message,
        })
      }
  
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  

// reset password

export const setNewPassword = async (req, res) => {

    try {
  
      const { resetPasswordOTP, password } = req.body;
      // console.log(resetPasswordOTP);
  
      const user = await User.findOne({
        resetPasswordOTP,
  
      });
  
      // console.log(user);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Reset Password OTP is invalid or has been expired",
        });
      }
  
  
      // console.log(900, user);
  
      if (user.verifyResetPasswordOTP(resetPasswordOTP)) {
        user.password = password;
  
        // Clear the OTP and its expiration time
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;
        await user.save();
        sendCookie(user, res, 200);
      } else {
        return res.status(400).json({
          success: false,
          message: "Cant't verify your otp",
        });
      }
  
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: "Cant't verify your otp",
      });
    }
  
  }
  
  