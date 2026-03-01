import nodeMailer from "nodemailer";

export const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        service: process.env.SMTP_SERVICE, // e.g., "gmail"
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: `"PMS - Project Management System" <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
};