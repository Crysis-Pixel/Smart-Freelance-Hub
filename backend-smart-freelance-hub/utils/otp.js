const nodemailer = require('nodemailer');
require('dotenv').config();  // Load environment variables from .env file

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

// Send OTP email using Mailgun SMTP
async function sendOTP(email, otp) {
    try {
        // Configure nodemailer transport using Mailgun SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailgun.org', // Mailgun SMTP server
            port: 587,                // Mailgun SMTP port (can also use 465 for SSL)
            auth: {
                user: "postmaster@sandbox47654a8a44094d3594b36826457e9616.mailgun.org", // Mailgun SMTP login (username)
                pass: "15a0d3284424dae064d467d14d92a876-5dcb5e36-5e9b33f2", // Mailgun SMTP password
            },
            tls: {
                rejectUnauthorized: false,  // Disable TLS certificate validation for testing (enable for production)
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,  // The sender's email address (must be verified in Mailgun)
            to: email,                     // Recipient's email address
            subject: 'Your OTP for Registration',
            text: `Your OTP for registration is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully to', email);
    } catch (err) {
        console.error('Error sending OTP:', err);
        throw new Error('Failed to send OTP');
    }
}

module.exports = { generateOTP, sendOTP };
