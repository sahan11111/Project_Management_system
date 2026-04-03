import fs from "fs";
import ErrorHandler from "../middlewares/error.js";
export const streamFileDownload = (filePath, originalName, res) => {
    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "File not found on server",
            });
        }

        res.download(filePath, originalName, (err) => {
            if (err) {
                console.error("Error downloading file:", err);
                if (!res.headersSent) {
                    return res.status(500).json({
                        success: false,
                        message: "Error downloading file",
                    });
                }
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