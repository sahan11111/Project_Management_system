import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

console.log("Testing Gmail connection...");
console.log("User:", process.env.SMTP_USER);
console.log("Pass:", process.env.SMTP_PASS ? "✅ Loaded" : "❌ Missing");

transporter.verify((error, success) => {
    if (error) {
        console.log("❌ CONNECTION FAILED!");
        console.log("Error Code:", error.code);
        console.log("Error Message:", error.message);
        console.log("Response:", error.response);
    } else {
        console.log("✅ Gmail connected successfully! Server is ready to send emails.");
    }
});