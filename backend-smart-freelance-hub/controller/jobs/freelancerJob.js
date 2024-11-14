const { getConnectedClient } = require("../../database/db");
require("dotenv").config();

exports.getFreelancerJob = async (req, res) => {
    try {
        console.log("attempting to find jobs for freelancer");
        
        const { freelancerEmail } = req.body;  // or req.query if using query parameters

        if (!freelancerEmail) {
            return res.status(400).json({ message: "freelancerEmail is required" });
        }

        const client = await getConnectedClient();
        const db = client.db(process.env.DATABASE_NAME);
        const collection = db.collection(process.env.COLLECTION_JOBS);

        const jobs = await collection.find({ freelancerEmail, status: "pending" }).toArray();

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
        console.error("Error retrieving jobs for freelancer:", err);
        res.status(500).json({ message: "Failed to retrieve jobs for freelancer" });
    }
};
