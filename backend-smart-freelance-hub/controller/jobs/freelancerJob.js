const { getConnectedClient } = require("../../database/db");
const { isClientReviewed } = require("./updateIsReviewed");
require("dotenv").config();

exports.getFreelancerJob = async (req, res) => {
  try {
    console.log("Attempting to find jobs for freelancer");

    const { freelancerEmail } = req.body; // Use req.query if passing as query parameters

    if (!freelancerEmail) {
      return res.status(400).json({ message: "freelancerEmail is required" });
    }

    const client = await getConnectedClient();
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection(process.env.COLLECTION_JOBS);

    // Find jobs with status "pending" or "assigned"
    const jobs = await collection
      .find({ freelancerEmail, status: { $in: ["pending", "assigned"] } })
      .toArray();

    // Format the jobs data for frontend
    const allJobs = jobs.map((job) => ({
      ...job,
      _id: job._id.toString(), // Convert _id to string
      requirements:
        typeof job.requirements === "string"
          ? job.requirements.split(", ").map((req) => req.trim())
          : [], // Default to an empty array if requirements are undefined
    }));

    res.status(200).json(allJobs);
  } catch (err) {
    console.error("Error retrieving jobs for freelancer:", err);
    res.status(500).json({ message: "Failed to retrieve jobs for freelancer" });
  }
};

exports.getFreelancerCompletedJob = async (req, res) => {
  try {
    console.log("Attempting to find jobs for freelancer");

    const { freelancerEmail } = req.body; // Use req.query if passing as query parameters

    if (!freelancerEmail) {
      return res.status(400).json({ message: "freelancerEmail is required" });
    }

    const client = await getConnectedClient();
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection(process.env.COLLECTION_JOBS);

    // Find jobs with status "pending" or "assigned"
    const jobs = await collection
      .find({ freelancerEmail, status: { $in: ["completed"] }, isClientReviewed: false })
      .toArray();

    // Format the jobs data for frontend
    const allJobs = jobs.map((job) => ({
      ...job,
      _id: job._id.toString(), // Convert _id to string
      requirements:
        typeof job.requirements === "string"
          ? job.requirements.split(", ").map((req) => req.trim())
          : [], // Default to an empty array if requirements are undefined
    }));

    res.status(200).json(allJobs);
  } catch (err) {
    console.error("Error retrieving jobs for freelancer:", err);
    res.status(500).json({ message: "Failed to retrieve jobs for freelancer" });
  }
};

