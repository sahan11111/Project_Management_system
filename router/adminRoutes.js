import express from 'express';
import { createStudent, updateStudent, deleteStudent , getAllStudents } from '../controllers/adminController.js';
import multer from 'multer';
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js"


const adminRouter = express.Router();

adminRouter.post('/create-student', isAuthenticated, isAuthorized("Admin"), createStudent);
adminRouter.put('/update-student/:id', isAuthenticated, isAuthorized("Admin"), updateStudent);
adminRouter.delete('/delete-student/:id', isAuthenticated, isAuthorized("Admin"), deleteStudent);
adminRouter.get('/get-students', isAuthenticated, isAuthorized("Admin"), getAllStudents);

export default adminRouter;