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

        user = await User.create({
            name,
            email,
            password
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
            .cookie("token", null, {
                expiresIn: new Date(
                    Date.now()
                ),
                httpOnly: true,
                sameSite: "None",
                secure: true
            }).json({
                success: true,
                message: "user Logout successfully"
            })

    } catch (error) {
        res.status(400).json({ success: false, message: 'Logout Failed.' });
    }
}

