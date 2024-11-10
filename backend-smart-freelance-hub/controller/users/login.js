const { getConnectedClient } = require('../../database/db');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { checkPassword } = require('../../utils/password');
const {findUserByEmail} = require('../../utils/findUserByEmail');
const {updateLastActive} = require('../../utils/updateLastActive');
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.login = async (req, res) => {
    // Extract data from request body
    const accountType = req.body.accountType;
    const email = req.body.email;
    const password = req.body.password;
    console.log("Attempting to login")
    try {
        // Find user by email
        const user = await findUserByEmail(email);
        
        // Check if user was found
        if (user && user.hashedPassword) {

            // Verify the password
            if (await checkPassword(password, user.hashedPassword)) {
                // User authenticated
                await updateLastActive(email);
                console.log("Logged In!");
                return res.status(200).json({ message: 'Success' });
            }
        }
        
        // If user not found or password incorrect
        res.status(500).json({ message: 'Invalid Credentials or user does not exist' });
        
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Login registration failed' });
    }
};
