const { getConnectedClient } = require("../database/db");
require("dotenv").config();

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Connect to database
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_users);

        // Find user by email
        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if OTP is correct and not expired
        if (user.otp === otp && user.otpExpires > Date.now()) {
            // Update user verification status
            await collection.updateOne(
                { email },
                { $set: { isVerified: true }, $unset: { otp: "", otpExpires: "" } }
            );

            res.status(200).json({ message: 'Account verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (err) {
        console.error('Error during OTP verification:', err);
        res.status(500).json({ message: 'OTP verification failed' });
    }
};
