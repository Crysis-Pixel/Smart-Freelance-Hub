const { getConnectedClient } = require('../../database/db');
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb
require('dotenv').config();
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.checkUserEmail = async (req, res) => {
    const { email } = req.body;
    try{
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_users);

        const user = await collection.findOne({ email });

        if (user) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to check email.' });
    }
    
};