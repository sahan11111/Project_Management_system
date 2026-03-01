import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true,
        maxLength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password must be at least 8 characters"],
        select: false,
    },
    role: {
        type: String,
        default: "Student",
        enum: ["Admin", "Teacher", "Student"],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    department: {
        type: String,
        trim: true,
        default: null,
    },
    expertise: {
        type: [String],
        default: [],
    },
    maxStudents: {
        type: Number,
        default: 10,
        min: [1, "Max students must be at least 1"],
    },
    assignedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null,
    },
}, {
    timestamps: true,
});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.generateToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function() {
    // Generate a random token
    const resetToken = crypto.randomBytes(20).toString("hex");
    
    // Hash the token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    // Set token expire time
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    // Return the original reset token
    return resetToken;
};


export const User = mongoose.model("User", userSchema);