import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js';
import { sendResponse } from '../utils/sendResponse.js';
export const isAuthenticate = async (req, res, next) => {

    try {

        const { token } = req.cookies;
        if (!token) {
            // checking success to the frontend so that we dont have to see 400 error i console
            return res.status(200).json({
                success: false,
                message: "You are not authenticated"
            })
            // sendResponse({ res, code: 400, success: false, message: "You are not authenticated" });
        }
        // decodedData is _id of the user that is stored in token
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData._id);

        next();
    } catch (error) {
        res.status(200).json({
            success: false,
            message: "You are not authenticated"
        })
        // sendResponse({ res, code: 400, success: false, message: "You are not authenticated" });
    }
}