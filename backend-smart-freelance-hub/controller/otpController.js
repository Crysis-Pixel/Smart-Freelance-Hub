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
        from: 'smartfreelancehub@gmail.com', // Your verified SendGrid sender
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It is valid for 60 seconds.`,
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
