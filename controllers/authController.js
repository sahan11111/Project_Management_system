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
    generateToken(user,201,"User registered successfully",res);
    // res.status(201).json({
    //     success: true,
    //     message: "User registered successfully",
    // });
});


export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }
    const user = await User.findOne({ email, role }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email , password or role", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email , password or role", 401));
    }
    generateToken(user,200,"User logged in successfully",res);
});



export const getUser = asyncHandler(async (req, res, next) => {});
export const logoutUser = asyncHandler(async (req, res, next) => {});
export const forgotPassword = asyncHandler(async (req, res, next) => {});
export const resetPassword = asyncHandler(async (req, res, next) => {});


