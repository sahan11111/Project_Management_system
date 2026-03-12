import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";


// Set up multer storage configuration
const __filename = fileURLToPath(import.meta.url); // Get the current file path
const __dirname = path.dirname(__filename); // Get the current directory path

const ensureUploadsDirExists = (dir)=>{
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;

        if (req.route.path.includes("/upload-file/:projectId")) {
            uploadPath = path.join(__dirname, "../uploads/projects", req.params.projectId);
        } else if(req.route.path.includes("/upload/:userId")) {
            uploadPath = path.join(__dirname, "../uploads/users", req.params.userId);
        } else {
            uploadPath = path.join(__dirname, "../uploads/temps");
        }

        ensureUploadsDirExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});