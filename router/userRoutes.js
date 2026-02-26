import express from 'express';
import { registerUser, loginUser, getUser, logoutUser, forgotPassword, resetPassword  } from '../controllers/authController.js';
import multer from 'multer';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;