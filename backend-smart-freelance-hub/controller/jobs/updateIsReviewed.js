const { getConnectedClient } = require("../../database/db");
require("dotenv").config();
const { findUserByEmail } = require("../../utils/findUserByEmail");
const { currentDate } = require("../../utils/date");
const { ObjectId} = require("mongodb")

exports.isClientReviewed = async (req, res) => {
  // Extract jobId and clientEmail from the request body
  const { jobId } = req.body;

  try {
    // Find user by email
    //const user = await findUserByEmail(clientEmail);

      // Connect to the database
      const client = await getConnectedClient();
      const db = client.db(process.env.DATABASE_NAME);
      const collection = db.collection(process.env.COLLECTION_JOBS);

      // Convert jobId to ObjectId
      const jobObjectId = new ObjectId(jobId);

      const findJob = await collection.findOne(jobObjectId);
      if (findJob.isClientReviewed === true) { 
        return res.status(404).json({ message: "client already reviewed!" });
      }
      // Update the job isReviewed to "true"
      const updateResult = await collection.updateOne(
        { _id: jobObjectId }, // Match job by jobId
        { $set: {"isClientReviewed": true} } // Set status to assigned and update timestamp
      );

      res.status(200).json({ message: "Job isClientReview info updated" });
  } catch (err) {
    console.error("Error during job client review:", err);
    res.status(500).json({ message: "Failed to update job client review" });
  }
};

exports.isFreelancerReviewed = async (req, res) => {
    // Extract jobId and clientEmail from the request body
    const { jobId } = req.body;
  
    try {
      // Find user by email
      //const user = await findUserByEmail(clientEmail);
  
        // Connect to the database
        const client = await getConnectedClient();
        const db = client.db(process.env.DATABASE_NAME);
        const collection = db.collection(process.env.COLLECTION_JOBS);
  
        // Convert jobId to ObjectId
        const jobObjectId = new ObjectId(jobId);
  
        const findJob = await collection.findOne(jobObjectId);
        if (findJob.isFreelancerReviewed === true) { 
          return res.status(404).json({ message: "freelancer already reviewed!" });
        }
        // Update the job isReviewed to "true"
        const updateResult = await collection.updateOne(
          { _id: jobObjectId }, // Match job by jobId
          { $set: {"isFreelancerReviewed": true} } // Set status to assigned and update timestamp
        );
  
        res.status(200).json({ message: "Freelancer review updated" });
    } catch (err) {
      console.error("Error during freelancerIsReviewed true:", err);
      res.status(500).json({ message: "Failed to update freelancer review status" });
    }
  };
