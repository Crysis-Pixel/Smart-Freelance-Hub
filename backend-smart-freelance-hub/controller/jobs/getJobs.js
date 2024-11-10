const { getConnectedClient } = require("../../database/db");
require("dotenv").config();

exports.getJobs = async (req, res) => {
    try {
        console.log("attempting to return jobs");
        const client = await getConnectedClient();
        const db = client.db(process.env.DATABASE_NAME);
        const collection = db.collection(process.env.COLLECTION_JOBS);

        // Fetch all jobs
        const jobs = await collection.find({}).toArray();

        // Return the jobs to the frontend
        const allJobs = jobs.map((job) => ({
            ...job,
            _id: job._id.toString(), // Convert _id to string
            requirements: typeof job.requirements === "string" 
                ? job.requirements.split(", ").map((req) => req.trim()) 
                : [], // default to an empty array if requirements is undefined
        }));
        res.status(200).json(allJobs);
    } catch (err) {
        console.error("Error retrieving jobs:", err);
        res.status(500).json({ message: "Failed to retrieve jobs" });
    }
};