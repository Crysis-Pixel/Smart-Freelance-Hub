const { getConnectedClient } = require("../../database/db");
require("dotenv").config();

exports.getJobs = async (req, res) => {
    try {
        console.log("attempting to return jobs");
        
        // Get clientEmail from request body or query
        const { clientEmail } = req.body;  // or req.query if using query parameters

        if (!clientEmail) {
            return res.status(400).json({ message: "clientEmail is required" });
        }

        const client = await getConnectedClient();
        const db = client.db(process.env.DATABASE_NAME);
        const collection = db.collection(process.env.COLLECTION_JOBS);

        // Fetch jobs only for the specific clientEmail
        const jobs = await collection.find({ clientEmail }).toArray();

        // Return the jobs to the frontend
        const allJobs = jobs.map((job) => ({
            ...job,
            _id: job._id.toString(), // Convert _id to string
            requirements: typeof job.requirements === "string" 
                ? job.requirements.split(", ").map((req) => req.trim()) 
                : [], // Default to an empty array if requirements are undefined
        }));

        res.status(200).json(allJobs);
    } catch (err) {
        console.error("Error retrieving jobs:", err);
        res.status(500).json({ message: "Failed to retrieve jobs" });
    }
};
