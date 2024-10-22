const { getConnectedClient } = require('../../database/db');
require('dotenv').config();
const {emailExist} = require("../../utils/emailExist");
const {currentDate} = require('../../utils/date');
const {findUserByEmail} = require("../../utils/findUserByEmail");
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.updateUserAccountType = async (req, res) => {
    const {email} = req.body;

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_users);
        
        const user = await findUserByEmail(email);
        if (!user) {
            console.log(`User with email ${email} not found`)
            return res.status(404).json(`User with email ${email} not found`);
        }
        if(user.accountType === "Both")
        {
            console.log(`User with ${email}'s accountType is already Both`)
            return res.status(200).json(`User with ${email}'s accountType is already Both`);
        }

        // Update the user in the database
        const result = await collection.updateOne(
            { email: email }, // Use the email from the request body
            { $set: { accountType : "Both", lastActive : currentDate()} }
        );
        console.log(`User with ${email}'s accountType has been updated to Both successfully`);

        res.status(200).json(`User with ${email}'s accountType has been updated to Both successfully`);
    } catch (err) {
        res.status(500).json(`Failed to update user: ${err.message}`);
    }
};
