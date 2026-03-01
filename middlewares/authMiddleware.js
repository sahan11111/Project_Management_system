import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import  asyncHandler  from "./asyncHandler.js";
import  ErrorHandler  from './error.js';



export const isAuthenticated = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Plese login to access this resource", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-resetPasswordToken -resetPasswordExpire");


    if (!req.user) {
        return next(new ErrorHandler("User not found", 404));
    }
    next();

});
