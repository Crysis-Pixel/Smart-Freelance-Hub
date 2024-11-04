const { getConnectedClient } = require('../../database/db');
require('dotenv').config();
const {emailExist} = require("../../utils/emailExist");
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.updateUser = async (req, res) => {
    const {firstName, lastName, email, country, phoneNumber, lookingForJob, accountType, fBio, cBio, skills, fRating, cRating, profilePicture, totalEarnings, lastActive, 
        jobsCompleted
    } = req.body;
    if (!emailExist(email)) {
        return res.status(400).json({ message: 'Invalid user' });
    }
    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_users);

        // Update the user in the database
        const result = await collection.updateOne(
            { email: email }, // Use the email from the request body
            { $set: { firstName, lastName, email, country, phoneNumber, lookingForJob, accountType, fBio, cBio, skills, fRating, cRating, profilePicture, totalEarnings, lastActive, 
                jobsCompleted } }
        );
        console.log(result);

        res.status(200).json(`User with ${email} has been updated successfully`);
    } catch (err) {
        res.status(500).send(`Failed to update user: ${err.message}`);
    }
};
