import  asyncHandler  from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import {User} from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";

 //Resister User

export const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User already exists", 400));
    }
    user = await User.create({
        name,
        email,
        password,
        role
    });
    // await user.save();
    generateToken(user,201,"User registered successfully",res);
    // res.status(201).json({
    //     success: true,
    //     message: "User registered successfully",
    // });
});


export const loginUser = asyncHandler(async (req, res, next) => {});
export const getUser = asyncHandler(async (req, res, next) => {});
export const logoutUser = asyncHandler(async (req, res, next) => {});
export const forgotPassword = asyncHandler(async (req, res, next) => {});
export const resetPassword = asyncHandler(async (req, res, next) => {});


