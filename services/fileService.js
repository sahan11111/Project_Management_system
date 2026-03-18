import fs from "fs";
import ErrorHandler from "../utils/errorHandler.js";
export const streamFileDownload = (filePath, originalName, res) => {
    try {
        if (!fs.existsSync(filePath)) {
            return new ErrorHandler("File not found", 404);
        }

        res.download(filePath, originalName, (err) => {
            if (err) {
                console.error("Error downloading file:", err);
                return new ErrorHandler("Error downloading file", 500);
            }
        });

    } catch (error) {
        if (error instanceof ErrorHandler) {
            return res.status(error.statusCode).json({
                success: false,
                error: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            error: "Error downloading file",
        });
    }
  
};