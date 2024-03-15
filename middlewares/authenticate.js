import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js';
export const isAuthenticate = async (req, res, next) => {

    try {

        const token = req.headers.token;
        if (!token) {
            return res.status(200).json({
                success: false,
                message: "You are not authenticated"
            })
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData._id);

        next();
    } catch (error) {
        res.status(200).json({
            success: false,
            message: "You are not authenticated"
        })
    }
}

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Only Admin can access this resouce `
                // message: `Role: ${req.user.role} is not allowed to access this resouce `
            });
        }

        next();
    };
};