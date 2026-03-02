class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    console.log("❌ Error caught:", err.message);
    console.log("❌ Error stack:", err.stack);

    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        err.message = "Invalid JWT token";
        err.statusCode = 401;
    }
    if (err.name === "TokenExpiredError") {
        err.message = "JWT token has expired";
        err.statusCode = 401;
    }
    if (err.name === "CastError") {
        err.message = `Resource not found. Invalid: ${err.path}`;
        err.statusCode = 400;
    }
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((e) => e.message).join(", ");
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ErrorHandler;