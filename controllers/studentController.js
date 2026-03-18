import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import mongoose from "mongoose";
import { User } from "../models/user.js";
import { Project } from "../models/project.js";
import * as userServices from "../services/userServices.js";
import * as projectService from "../services/projectService.js";
import * as requestService from "../services/requestService.js";
import * as notificationService from "../services/notificationService.js";
import * as fileService from "../services/fileService.js";
import { Notification } from "../models/notification.js";

// Controller function to get the current project of the student
export const getStudentProject = asyncHandler(async (req, res, next) => {
    const studentId = req.user._id;

    const project = await projectService.getProjectByStudentId(studentId);
    if (!project) {
        res.status(200).json({
            success: true,
            data: {
                project: null
            },
            message: "No project found for this student"
        });
    } else {
        res.status(200).json({
            success: true,
            data: {
                project
            },
            message: "Project retrieved successfully"
        });
    }
}); 

// Controller function to handle project proposal submission
export const submitProposal = asyncHandler(async (req, res, next) => {
    const { title, description } = req.body;
    const studentId = req.user._id;

    const existingProject = await projectService.getProjectByStudentId(studentId);

    if (existingProject && existingProject.status !== "rejected") {
        return next(new ErrorHandler(
            "You already have a pending or approved project proposal",
             400
        ));
    }

    const projectData = {
        student: studentId,
        title,
        description,
    };

    const project = await projectService.createProject(projectData);

    await User.findByIdAndUpdate(studentId, { projects: project._id } );

    res.status(201).json({
        success: true,
        data: {
            project
        },
        message: "Proposal submitted successfully"
    });

});

// Controller function to handle file uploads for a project
export const uploadFile = asyncHandler(async (req, res, next) => {
    const {projectId} = req.params;
    const studentId = req.user._id;
    const project = await projectService.getProjectById(projectId);
    const uploadedFiles = [
        ...(req.files?.files || []),
        ...(req.files?.file || []),
    ];

    if (!project || project.student.toString() !== studentId.toString()) {
        return next(new ErrorHandler("Project not found or access denied", 404));
    }
    if (uploadedFiles.length === 0) {
        return next(new ErrorHandler("No file uploaded", 400));
    }
    const updatedProject = await projectService.addFileToProject(projectId, uploadedFiles);

    res.status(200).json({
        success: true,
        data: {
            project: updatedProject
        },
        message: "File uploaded successfully"
    });
});

// Controller function to get available supervisors for the student to choose from
export const getAvailableSupervisors = asyncHandler(async (req, res, next) => {
    const supervisors = await User
    .find({ role: "Teacher" })
    .select("name email department expertise ")
    .lean(); // Use lean() for better performance when no Mongoose document methods are needed only for read operations
    res.status(200).json({
        success: true,
        data: {
            supervisors
        },
        message: "Available supervisors fetched successfully"
    });

});

// Controller function to get the assigned supervisor for the student
export const getSupervisor = asyncHandler(async (req, res, next) => {
    const studentId = req.user._id;
    const student = await User.findById(studentId).populate("supervisor", "name email department expertise").lean(); // Use lean() for better performance when no Mongoose document methods are needed only for read operations
    if (!student.supervisor) {
        return res.status(200).json({
            success: true,
            data: { supervisor: null },
            message: "No supervisor assigned yet"
        });
    }
    res.status(200).json({
        success: true,
        data: {
            supervisor: student.supervisor
        },
        message: "Supervisor fetched successfully"
    });
    
});

// Additional controller functions for fetching all supervisors, requesting a supervisor, etc. can be implemented similarly
export const requestSupervisor = asyncHandler(async (req, res, next) => {
    const { teacherId, message } = req.body;
    const studentId = req.user._id;
    const normalizedTeacherId = typeof teacherId === "object"
        ? teacherId?._id || teacherId?.id
        : teacherId;

    if (!normalizedTeacherId) {
        return next(new ErrorHandler("Teacher ID is required", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(normalizedTeacherId)) {
        return next(new ErrorHandler("Invalid teacher ID", 400));
    }

    const student = await User.findById(studentId);
    if(student.supervisor) {
        return next(new ErrorHandler("You already have a supervisor assigned", 400));
    }

    const supervisor = await User.findById(normalizedTeacherId);
    if (!supervisor || supervisor.role !== "Teacher") {
        return next(new ErrorHandler("Teacher not found", 404));
    }
    
    if(supervisor.maxStudents === supervisor.assignedStudents.length) {
        return next(new ErrorHandler("Supervisor has reached maximum student capacity", 400));
    }

    const requestData = {
        student: studentId,
        supervisor: normalizedTeacherId,
        message: (message || `${student.name} requested you as a supervisor.`).trim(),
    };

    const { request, isExisting } = await requestService.createRequest(requestData);

    if (!isExisting) {
        await notificationService.notifyUser(
            normalizedTeacherId,
            `You have a new supervisor request from ${student.name}`,
            "request",
            "/teacher/requests",
            "medium",
        );
    }

    res.status(200).json({
        success: true,
        data: {
            request
        },
        message: isExisting
            ? "Request already exists. Please wait for the previous request to be processed."
            : "Supervisor request sent successfully"
    });
});

export const getDashboardStats = asyncHandler(async (req, res, next) => {
    const studentId = req.user._id;

    const project = await Project.findOne({ student: studentId }).sort({ createdAt: -1 }).populate("supervisor", "name").lean(); // Use lean() for better performance when no Mongoose document methods are needed only for read operations
    
    const now = new Date();
    const upcomingDeadlines =  await Project.find({
        student: studentId,
        deadline: { $gte: now }
    }).select("title description").sort({ deadline: 1 }).limit(3).lean(); // Use lean() for better performance when no Mongoose document methods are needed only for read operations

    const topNotifications = await Notification.find({ 
        user: studentId})
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(); // Use lean() for better performance when no Mongoose document methods are needed only for read operations

    const feedbackNotifications = 
        project?.feedback && project?.feedback.length > 0
        ? project.feedback
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
        : [];

    const supervisorName = project?.supervisor?.name || "No supervisor assigned";

    res.status(200).json({
        success: true,
        data: {
            project,
            upcomingDeadlines,
            topNotifications,
            feedbackNotifications,
            supervisorName
        },
        message: "Dashboard stats fetched successfully"
    });

});

export const getFeedback = asyncHandler(async (req, res, next) => {
    const {projectId} = req.params;
    const studentId = req.user._id;
    const project = await projectService.getProjectById(projectId);

    if (!project || project.student.toString() !== studentId.toString()) {
        return next(new ErrorHandler("Project not found or access denied", 404));
    }

    const sortedFeedback = project.feedback.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort feedback by most recent first

    res.status(200).json({
        success: true,
        data: {
            feedback: sortedFeedback
        },
        message: "Feedback fetched successfully"
    });
});

export const downloadFile = asyncHandler(async (req, res, next) => {
    const {projectId, fileId} = req.params;
    const studentId = req.user._id;
    const project = await projectService.getProjectById(projectId);
    if (!project || project.student.toString() !== studentId.toString()) {
        return next(new ErrorHandler("Project not found or access denied", 404));
    }
    const file = project.files.id(fileId);
    if (!file) {
        return next(new ErrorHandler("File not found", 404));
    }
    fileService.streamFileDownload(file.fileUrl, file.originalName, res);
});