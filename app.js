import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from "./middlewares/error.js"; // ✅ named import
import authRoutes from './router/userRoutes.js';

config();

const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);

app.use(errorMiddleware); // ✅ must be last, must have 4 params (err, req, res, next)

export default app;