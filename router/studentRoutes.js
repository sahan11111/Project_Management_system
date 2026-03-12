import express from 'express';
import { 
    getStudentProject,
    submitProposal,
    uploadFile,
    getAvailableSupervisors
 } from '../controllers/studentController.js';
import multer from 'multer';
import path from 'path';
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js"
import { upload, handleUploadError } from '../middlewares/upload.js';


const studentRouter = express.Router();

studentRouter.get('/project', isAuthenticated, isAuthorized("Student"), getStudentProject);
studentRouter.post('/proposal', isAuthenticated, isAuthorized("Student"), submitProposal);
studentRouter.post('/upload-file/:projectId', isAuthenticated, isAuthorized("Student"),
upload.array('files', 10),
handleUploadError,
uploadFile);
studentRouter.get('/supervisors', isAuthenticated, isAuthorized("Student"), getAvailableSupervisors);

export default studentRouter;