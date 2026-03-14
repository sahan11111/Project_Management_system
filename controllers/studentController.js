import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { Project } from "../models/project.js";
import * as userServices from "../services/userServices.js";
import * as projectService from "../services/projectService.js";
import * as requestService from "../services/requestService.js";
import * as notificationService from "../services/notificationService.js";

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

    if (!project || project.student.toString() !== studentId.toString()) {
        return next(new ErrorHandler("Project not found or access denied", 404));
    }
    if (!req.file || !req.file.length === 0) {
        return next(new ErrorHandler("No file uploaded", 400));
    }
    const updatedProject = await projectService.addFileToProject(projectId, req.file);

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
    const teacherId = req.body;
    const studentId = req.user._id;

    const student = await User.findById(studentId);
    if(student.supervisor) {
        return next(new ErrorHandler("You already have a supervisor assigned", 400));
    }

    const supervisor = await User.findById(teacherId);
    if (!supervisor || supervisor.role !== "Teacher") {
        return next(new ErrorHandler("Teacher not found", 404));
    }
    
    if(supervisor.maxStudents === supervisor.assignedStudents.length) {
        return next(new ErrorHandler("Supervisor has reached maximum student capacity", 400));
    }

    const requestData = {
        student: studentId,
        supervisor: teacherId,
        message,
    };

    const request = await requestService.createRequest(requestData);

    await notificationService.notifyUser(
        teacherId,
        `You have a new supervisor request from ${student.name}`,
        "request",
        "/teacher/requests",
        "medium",
        
    );
    res.status(200).json({
        success: true,
        data: {
            request
        },
        message: "Supervisor request sent successfully"
    });
});