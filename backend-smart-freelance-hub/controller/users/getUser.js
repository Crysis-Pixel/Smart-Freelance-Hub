// controllers/getUserById.js
const { getConnectedClient } = require('../../database/db');
require('dotenv').config();
const {emailExist} = require("../../utils/emailExist");
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.getUser = async (req, res) => {
    const { email } = req.body; // Get the Email from the request body

    // Check if the ID is valid
    if (!emailExist(email)) {
        return res.status(400).json({ message: 'Invalid user' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_users);

        const user = await collection.findOne({ email: email }); // Retrieve user by Email
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const { hashedPassword, otp, otpExpires, _id, ...userInfo } = user;
        res.status(200).json(userInfo); // Return the user details
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
};
