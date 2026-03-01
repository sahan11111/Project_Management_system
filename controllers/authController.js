import  asyncHandler  from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import {User} from "../models/user.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTempates.js";
import { generateToken } from "../utils/generateToken.js";
import {sendEmail} from "../services/emailService.js";
import crypto from "crypto";

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


export const logoutUser = asyncHandler(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()), 
        httpOnly: true,}).json({
            success: true,
            message: "User logged out successfully",
        });
    });
    
    
export const getUser = asyncHandler(async (req, res, next) => {
    const user = req.user;  // req.user is set in the isAuthenticated middleware
    res.status(200).json({
        success: true,
        user,
    });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();

    // Save the user with the reset token and expiry
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Generate email template
    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "PMS - 🔐 Password Reset Request",
            message: message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch (error) {
        // Clear reset token and expiry on error
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        // ✅ Pass error to next properly
        return next(new ErrorHandler(error.message || "Failed to send email", 500));
    }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new ErrorHandler("Invalid or expired password reset token", 400));
    }
    if(!req.body.password || !req.body.confirmPassword){
        return next(new ErrorHandler("Please provide both password and confirmPassword", 400));
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password and confirm password do not match", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    generateToken(user,200,"Password reset successfully",res);
});
