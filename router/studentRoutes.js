import express from 'express';
import { 
    getStudentProject,
    submitProposal,
    uploadFile,
    getAvailableSupervisors,
    getSupervisor,
    requestSupervisor,
    getFeedback,
    getDashboardStats,
    downloadFile
 } from '../controllers/studentController.js';
import multer from 'multer';
import path from 'path';
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js"
import { upload, handleUploadError } from '../middlewares/upload.js';


const studentRouter = express.Router();

studentRouter.get('/project', isAuthenticated, isAuthorized("Student"), getStudentProject);
studentRouter.post('/proposal', isAuthenticated, isAuthorized("Student"), submitProposal);
studentRouter.post('/upload-file/:projectId', isAuthenticated, isAuthorized("Student"),
upload.fields([
    { name: 'files', maxCount: 10 },
    { name: 'file', maxCount: 10 }
]),
handleUploadError,
uploadFile);
studentRouter.get('/supervisors', isAuthenticated, isAuthorized("Student"), getAvailableSupervisors);
studentRouter.get('/supervisor', isAuthenticated, isAuthorized("Student"), getSupervisor);
studentRouter.post('/request-supervisor', isAuthenticated, isAuthorized("Student"), requestSupervisor);
studentRouter.get('/feedback/:projectId', isAuthenticated, isAuthorized("Student"), getFeedback);
studentRouter.get('/fetch-dashboard-stats', isAuthenticated, isAuthorized("Student"), getDashboardStats);
studentRouter.get('/download-file/:projectId/:fileId', isAuthenticated, isAuthorized("Student"), downloadFile);

export default studentRouter;