const { getConnectedClient } = require('../database/db');
require('dotenv').config();
const bcrypt = require('bcrypt');
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.login = async (req, res) => {
    // Extract data from request body
    const accountType = req.body.accountType;
    const email = req.body.email;
    const password = req.body.password;

    try {
        // Find user by email
        const user = await findUserByEmail(email);
        
        // Check if user was found
        if (user && user.hashedPassword) {

            // Verify the password
            if (await checkPassword(password, user.hashedPassword)) {
                // User authenticated
                return res.json({ message: 'Success' });
            }
        }
        
        // If user not found or password incorrect
        res.json({ message: 'Wrong Password' });
        
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Login registration failed' });
    }
};

async function checkPassword(plainPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        if (match) {
            console.log('Password matches');
            return true;  // Password is correct
        } else {
            console.log('Password does not match');
            return false; // Password is incorrect
        }
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
}

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
