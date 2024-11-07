const { getConnectedClient } = require("../../database/db");
require("dotenv").config();
const {findUserByEmail} = require("../../utils/findUserByEmail");
const { isUserActive, currentDate } = require("../../utils/date");

const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.postJob = async (req, res) => {
    // Extract data from request body
    const { title, description, requirements, clientEmail } = req.body;
    
    console.log("Attempting to Post Job")
    try {
        // Find user by email
        const user = await findUserByEmail(clientEmail);
        
        // Check if user was found
        if (user) {
        // Connect to the database
        const client = await getConnectedClient();
        const db = client.db(process.env.DATABASE_NAME);
        const collection = db.collection(process.env.COLLECTION_JOBS);
        
        // Insert the job data into the collection
    const newJob = {
        status: 'unassigned',
        title,
        description,
        requirements,
        clientEmail,
        createdAt: currentDate(),
      };
        const result = await collection.insertOne(newJob);

        res.status(200).json({
            message: "Success", 
            ...newJob,
            requirements: requirements.split(", ").map((req) => req.trim()), // response as array
        });
        console.log("Job successfully posted");
        }
        else {
            res.status(400).json({ message: 'Job Post Failed' });
        }
    } catch (err) {
        console.error('Error during job post:', err);
        res.status(500).json({ message: 'Job Post Failed' });
    }
};