// controllers/deleteuser.js
const { getConnectedClient } = require('../database/db');
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb
require('dotenv').config();
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.deleteUser = async (req, res) => {
    const { userId } = req.body; // Expect userId to be in the request body

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_users);

        const result = await collection.deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
