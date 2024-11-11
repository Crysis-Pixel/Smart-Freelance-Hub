const { getConnectedClient } = require('../../database/db');
require('dotenv').config();
const {emailExist} = require("../../utils/emailExist");
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.updateUserBalance = async (req, res) => {
    await sleep(5000);
    const {email, amount} = req.body;
    if (!emailExist(email) || !amount) {
        return res.status(400).json({ message: 'Invalid user or amount given' });
    }
    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_users);

        // Update the user in the database
        const result = await collection.updateOne(
            { email: email }, // Use the email from the request body
            { $inc: { totalBalance: amount } }
        );
        console.log(result);

        res.status(200).json(`Top up successful`);
    } catch (err) {
        res.status(500).send(`Failed to update user balance: ${err.message}`);
    }
};

exports.updateUser = async (req, res) => {
    console.log("Updating User");
    const { email } = req.body; // Extract email to identify the user
    if (!emailExist(email)) {
        return res.status(400).json({ message: 'Invalid user' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_users);

        // Initialize an empty update object
        const updateFields = {};

        // Dynamically add fields to the update object if they are present in req.body
        for (const [key, value] of Object.entries(req.body)) {
            if (value !== undefined && key !== 'email' && key!= 'profilePicture') { // Exclude undefined values and email from updates
                updateFields[key] = value;
            }
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        // Perform the update operation
        const result = await collection.updateOne(
            { email: email }, // Find the user by email
            { $set: updateFields } // Only update the specified fields
        );

        // if (result.modifiedCount === 0) {
        //     return res.status(404).json({ message: `User with email ${email} not found or no fields were updated.` });
        // }

        res.status(200).json({ message: `User with email ${email} has been updated successfully.` });
    } catch (err) {
        res.status(500).send(`Failed to update user: ${err.message}`);
    }
};

