import express from 'express';
import { registerUser, loginUser, getUser, logoutUser, forgotPassword, resetPassword  } from '../controllers/authController.js';
import multer from 'multer';
import { isAuthenticated } from "../middlewares/authMiddleware.js"
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', isAuthenticated, getUser);
router.get('/logout', isAuthenticated, logoutUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;


