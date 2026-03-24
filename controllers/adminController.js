import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import * as userServices from "../services/userServices.js";

// Controller function to create a new student
export const createStudent =asyncHandler(async (req, res,next) => {
    const { name, email, password, department } = req.body;
    if (!name || !email || !password || !department) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }
    const user = await userServices.createUser({ name, email, password, department, role: "Student" });
    res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: { user},
    });
});

// Controller function to update a student by ID
export const updateStudent = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.role; // Prevent role update

    const user = await userServices.updateUser(id, updateData);
    if (!user) {
        return next(new ErrorHandler("Student not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Student updated successfully",
        data: { user },
    });
});

// Controller function to delete a teacher by ID
export const deleteStudent = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await userServices.getUserById(id);
    if (!user) {
        return next(new ErrorHandler("Student not found", 404));
    }
    if(user.role !== "Student") {
        return next(new ErrorHandler("User is not a student", 400));
    }
    await userServices.deleteUser(id);
    res.status(200).json({
        success: true,
        message: "Student deleted successfully",
    });
});

// Additional controller functions for fetching all students, etc. can be implemented similarly
export const createTeacher = asyncHandler(async (req, res, next) => {
    const { 
        name, 
        email, 
        password, 
        department, 
        expertise, 
        maxStudents 
    } = req.body;

    if (!name || !email || !password || !department || !expertise || !maxStudents) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    const user = await userServices.createUser({
        name,
        email,
        password,
        department,
        expertise: Array.isArray(expertise)
            ? expertise
            : typeof expertise === "string" && expertise.trim() !== ""
                ? expertise.split(",").map((e) => e.trim())
                : [],
        maxStudents,
        role: "Teacher"
    });

    res.status(201).json({
        success: true,
        message: "Teacher created successfully",
        data: { user }
    });
});

// Additional controller functions for fetching all teachers, etc. can be implemented similarly
export const updateTeacher = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.role; // Prevent role update
    if (updateData.expertise) {
        updateData.expertise = Array.isArray(updateData.expertise)
            ? updateData.expertise
            : typeof updateData.expertise === "string" && updateData.expertise.trim() !== ""
                ? updateData.expertise.split(",").map((e) => e.trim())
                : [];
    }   

    const user = await userServices.updateUser(id, updateData);
    if (!user) {
        return next(new ErrorHandler("Teacher not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Teacher updated successfully",
        data: { user },
    });
});

// Additional controller functions for fetching all teachers, etc. can be implemented similarly
export const deleteTeacher = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await userServices.getUserById(id);
    if (!user) {
        return next(new ErrorHandler("Teacher not found", 404));
    }
    if(user.role !== "Teacher") {
        return next(new ErrorHandler("User is not a teacher", 400));
    }   
    await userServices.deleteUser(id);
    res.status(200).json({
        success: true,
        message: "Teacher deleted successfully",
    });
});

// get all users (students + teachers)
export const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await userServices.getAllUsers();

    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: { users },
    });
});

export const getAllStudents = asyncHandler(async (req, res, next) => {
    const students = await userServices.getUsersByRole("Student");
    res.status(200).json({
        success: true,
        message: "Students fetched successfully",
        data: { students },
    });
});


