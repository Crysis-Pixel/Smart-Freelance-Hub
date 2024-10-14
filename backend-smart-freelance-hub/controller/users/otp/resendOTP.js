const { getConnectedClient } = require("../../../database/db");
const { generateOTP, sendOTP } = require("../../../utils/otp");
require("dotenv").config();
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        // Generate OTP
        const otp = generateOTP();

        // connect to database
        client = getConnectedClient();
        var db = client.db(db_name);
        const collection = db.collection(collection_users);
        // Update the user's OTP and OTP expiration time in the database
        const updateResult = await collection.updateOne(
            { email: email }, // Find the user by email
            {
                $set: {
                    otp: otp, // Set the new OTP
                    otpExpires: Date.now() + 15 * 60 * 1000 // Set the OTP expiration time (15 minutes)
                }
            }
        );
        // Send OTP to user email
        await sendOTP(email, otp);

        res.status(200).json({ message: "Success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "OTP resend fail" });
    }
};
