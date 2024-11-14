const { getConnectedClient } = require("../../database/db");
const { ObjectId } = require("mongodb");
require("dotenv").config();

const db_name = process.env.DATABASE_NAME;
const collection_jobs = process.env.COLLECTION_JOBS;

exports.cancelJob = async (req, res) => {
  const { jobId } = req.body;
  console.log(jobId);
  try {
    // Convert jobId to MongoDB ObjectId
    const jobObj = new ObjectId(jobId);

    // Connect to the database
    const client = await getConnectedClient();
    const db = client.db(db_name);
    const collection = db.collection(collection_jobs);

    // Delete the job with the specified ObjectId
    const result = await collection.deleteOne({ _id: jobObj });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Job canceled successfully" });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (err) {
    console.error("Error canceling job:", err);
    res.status(500).json({ message: "Job cancellation failed" });
  }
};
