import nodeMailer from "nodemailer";

export const sendEmail = async (options) => {
    try {
        const transporter = nodeMailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        service: process.env.SMTP_SERVICE,
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
    } 
    catch (error) {

        throw new Error(error.message || "Failed to send email");
    }

    
};