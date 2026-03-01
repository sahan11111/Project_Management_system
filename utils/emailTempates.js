export function generateForgotPasswordEmailTemplate(resetPasswordUrl){
    return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #3b82f6; margin: 0;"> PMS - 🔐 Password Reset Request</h2>
            <p style="font-size: 14px; color: #6b7280; margin: 5px 0 0;">You requested to reset your password</p>
        </div>

        <!-- Body -->
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 16px; color: #374151;">Hi there,</p>
            <p style="font-size: 16px; color: #374151;">We received a request to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetPasswordUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-size: 16px;">Reset Password</a>
            </div>
            <p style="font-size: 14px; color: #6b7280;">If you didn't request a password reset, please ignore this email.</p>
            <p style="font-size: 14px; color: #6b7280;">Thanks,<br/>The Project Management System Team</p>
        </div> 
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 20px;">
            <p style="font-size: 12px; color: #9ca3af;">© 2024 Project Management System. All rights reserved.</p>
        </div>
    </div>
    `;  

}