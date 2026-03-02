import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
    console.log("=== SEND EMAIL CALLED ===");
    console.log("To:", options.email);
    console.log("Subject:", options.subject);
    console.log("SMTP_SERVICE:", process.env.SMTP_SERVICE);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS:", process.env.SMTP_PASS ? "✅ Set" : "❌ MISSING");

    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        console.log("Verifying transporter...");
        await transporter.verify();
        console.log("✅ Transporter verified!");

        const mailOptions = {
            from: `"PMS" <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.message,
        };

        console.log("Sending email...");
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent! ID:", info.messageId);
        return info;

    } catch (error) {
        console.log("❌ SEND EMAIL ERROR:", error.message);
        console.log("Full error:", error);
        throw error;
    }
};