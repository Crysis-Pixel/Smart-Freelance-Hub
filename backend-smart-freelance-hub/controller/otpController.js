// controllers/otpController.js
const sendgrid = require('@sendgrid/mail');
const crypto = require('crypto');

// Configure SendGrid
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);  // Store API key in .env

// Temporary in-memory store for OTPs (use Redis or a database for production)
const otpStore = {};

// Helper function to generate OTP
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
}

// Send OTP function
exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    // Generate and store OTP with expiration time (60 seconds)
    const otp = generateOTP();
    const expirationTime = Date.now() + 60 * 1000; // 60 seconds from now

    // Store OTP in the temporary store
    otpStore[email] = { otp, expirationTime };

    // Send OTP email
    const msg = {
        to: email,
        from: process.env.SENDGRID_EMAIL, // Your verified SendGrid sender
        subject: 'Your OTP Code',
        html: `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                }
                h1 {
                    color: #333;
                    text-align: center;
                }
                p {
                    font-size: 16px;
                    color: #555;
                    line-height: 1.5;
                }
                .otp-code {
                    display: inline-block;
                    background-color: #e7f4ff;
                    color: #007bff;
                    font-weight: bold;
                    padding: 10px 15px;
                    border-radius: 4px;
                    font-size: 24px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: #aaa;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Your OTP Code</h1>
                <p>Dear User,</p>
                <p>Your OTP code is <span class="otp-code">${otp}</span>. It is valid for 60 seconds.</p>
                <p>Please enter this code to complete your transaction.</p>
                <p>Thank you for using Smart Freelance Hub!</p>
                <div class="footer">
                    <p>If you did not request this code, please ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
    `,
    };

    try {
        await sendgrid.send(msg);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// Verify OTP function
exports.verifyOTP = (req, res) => {
    const { email, otp } = req.body;
    console.log(email);
    console.log(otp);
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Retrieve OTP and expiration time from store
    const storedOTP = otpStore[email];

    if (!storedOTP) {
        return res.status(400).json({ message: 'OTP not found or expired' });
    }

    // Check if OTP is valid and not expired
    if (storedOTP.otp === otp && Date.now() < storedOTP.expirationTime) {
        // OTP is correct and within valid time
        delete otpStore[email]; // Clear OTP from store after verification
        return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
};
