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
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/zip",
        "application/x-zip-compressed",
        "application/x-rar-compressed",
        "application/x-rar",
        "application/vnd.rar",
        "application/octet-stream",
        "image/jpeg",
        "image/png",
        "image/gif",
        "text/plain",
        "application/javascript",
        "text/css",
        "text/html",
        "application/json",
    ];
    const allowedExtensions = [
        ".pdf",
        ".doc",
        ".docx",
        ".ppt",
        ".pptx",
        ".zip",
        ".rar",
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".txt",
        ".js",
        ".css",
        ".html",
        ".json",
    ];

    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExt)) {
        cb(null, true);
    } else {
        cb(new Error('Only document, image, and code files are allowed'), false);
    } 
};
    

export const upload = multer({
    storage,
    limits: { 
        fileSize: 10 * 1024 * 1024 , file : 10 }, // 10MB limit to 10 files
    fileFilter
});

const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ success: false, message: "File size exceeds the 10MB limit" });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({ success: false, message: "File count exceeds the limit of 10 files" });
        }
        if(err.message && err.message.includes("invalid file type")) {
            return res.status(400).json({ success: false, message: err.message });
        }
    }
    next(err);
};


export { handleUploadError };