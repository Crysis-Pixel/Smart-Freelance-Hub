const { getConnectedClient } = require('../database/db');
require('dotenv').config();
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;


async function findUserByEmail(email) {
    try {
        // Connect to the MongoDB server
        console.log('Connecting to database...');
        const client = getConnectedClient();
        const db = client.db(db_name);
        const usersCollection = db.collection(collection_users);

        // Find the user by email
        const user = await usersCollection.findOne({ email: email });
        if (!user) {
            console.log('User not found');
            return null; // Return null if user not found
        }
        console.log("user found")
        return user; // Return the found user
    } catch (error) {
        console.error('Error finding user by email:', error);
        return null; // Return null on error
    }
}
module.exports = {findUserByEmail};