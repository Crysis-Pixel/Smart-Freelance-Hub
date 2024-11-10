// controllers/getUserById.js
const { getConnectedClient } = require('../../database/db');
require('dotenv').config();
const { emailExist } = require("../../utils/emailExist");

const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.getUser = async (req, res) => {
    const { email } = req.body; // Get the Email from the request body
        
    // Check if the email exists
    if (!await emailExist(email)) {
        return res.status(400).json({ message: 'Invalid user' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_users);

        const user = await collection.findOne({ email: email }); // Retrieve user by email
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Destructure sensitive fields and exclude them from the response
        const { hashedPassword, otp, otpExpires, _id, profilePicture, ...userInfo } = user;
        
        // Add accessible URL for the profile picture if it exists
        if (profilePicture) {
            userInfo.profilePicture = `http://localhost:3000${profilePicture}`;
        }
        res.status(200).json(userInfo); // Return the user details with accessible profile picture URL
    } catch (err) {
        console.error("Failed to retrieve user:", err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
};
