const { getConnectedClient } = require('../database/db');
require('dotenv').config();
const {currentDate} = require('./date');
const {findUserByEmail} = require("./findUserByEmail");
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

async function updateLastActive(email){
    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_users);
        
        const user = await findUserByEmail(email);
        if (!user) {
            console.log(`User with email ${email} not found`)
            return res.status(404).json(`User with email ${email} not found`);
        }
        // Update the user in the database
        const result = await collection.updateOne(
            { email: email }, // Use the email from the request body
            { $set: { lastActive : currentDate()} }
        );
        console.log(`User with ${email}'s lastActive has been updated successfully`);

        return true
    } catch (err) {
        console.log(`Failed to update user: ${err.message}`);
        return false;
    }
};
module.exports = {updateLastActive}