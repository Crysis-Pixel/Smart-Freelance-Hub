const { getConnectedClient } = require('../database/db');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.updateuser = async (req, res) => {
    const { userId, username, email, passwordHash, accountType, bio, profilePicture, totalEarnings, isActive } = req.body;

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_users);

        // Update the user in the database
        const result = await collection.updateOne(
            { _id: new ObjectId(userId) }, // Use the userId from the request body
            { $set: { username, email, passwordHash, accountType, bio, profilePicture, totalEarnings, isActive } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send(`User with ID ${userId} not found`);
        }

        res.send(`User with ID ${userId} has been updated successfully`);
    } catch (err) {
        res.status(500).send(`Failed to update user: ${err.message}`);
    }
};
