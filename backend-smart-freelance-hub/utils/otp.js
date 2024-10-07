const nodemailer = require('nodemailer');
require('dotenv').config();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

// Send OTP email using nodemailer
async function sendOTP(email, otp) {
    try {
        // Configure nodemailer transport (use your own SMTP server or a free service like Gmail)
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL, // your Gmail address
                pass: process.env.EMAIL_PASSWORD, // your Gmail password or App password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
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
module.exports = {generateOTP, sendOTP}