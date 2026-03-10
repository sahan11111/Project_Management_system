import express from 'express';
import { createStudent, updateStudent, deleteStudent , getAllStudents, createTeacher, updateTeacher, deleteTeacher, getAllTeachers, getAllUsers } from '../controllers/adminController.js';
import multer from 'multer';
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js"


const adminRouter = express.Router();

adminRouter.post('/create-student', isAuthenticated, isAuthorized("Admin"), createStudent);
adminRouter.put('/update-student/:id', isAuthenticated, isAuthorized("Admin"), updateStudent);
adminRouter.delete('/delete-student/:id', isAuthenticated, isAuthorized("Admin"), deleteStudent);
adminRouter.get('/get-students', isAuthenticated, isAuthorized("Admin"), getAllStudents);
adminRouter.post('/create-teacher', isAuthenticated, isAuthorized("Admin"), createTeacher);
adminRouter.put('/update-teacher/:id', isAuthenticated, isAuthorized("Admin"), updateTeacher);
adminRouter.delete('/delete-teacher/:id', isAuthenticated, isAuthorized("Admin"), deleteTeacher);
adminRouter.get('/get-teachers', isAuthenticated, isAuthorized("Admin"), getAllTeachers);
adminRouter.get('/get-users', isAuthenticated, isAuthorized("Admin"), getAllUsers);

export default adminRouter;