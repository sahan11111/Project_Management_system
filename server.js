import { config } from 'dotenv';
config();

// ✅ ADD THIS DEBUG BLOCK
console.log("=== ENV CHECK ===");
console.log("SMTP_SERVICE:", process.env.SMTP_SERVICE);
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "✅ Loaded" : "❌ MISSING");
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("=================");
import { connectDB } from './config/db.js';
import app from './app.js';

// Database connection

connectDB();


// Start the server
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// error handling
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);

});

export default server;