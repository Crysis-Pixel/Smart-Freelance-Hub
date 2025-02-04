const { getConnectedClient } = require("../../database/db");
require("dotenv").config();
const { findUserByEmail } = require("../../utils/findUserByEmail");
const { currentDate } = require("../../utils/date");
const { ObjectId} = require("mongodb")

exports.assignJob = async (req, res) => {
  // Extract jobId and clientEmail from the request body
  const { jobId, clientEmail, freelancerEmail,  } = req.body;

  try {
    // Find user by email
    const user = await findUserByEmail(clientEmail);
    const user2 = await findUserByEmail(clientEmail);

    // Check if user was found
    if (user && user2) {
      // Connect to the database
      const client = await getConnectedClient();
      const db = client.db(process.env.DATABASE_NAME);
      const collection = db.collection(process.env.COLLECTION_JOBS);
      const userCollection = db.collection(process.env.COLLECTION_USERS);


      // Convert jobId to ObjectId
      const jobObjectId = new ObjectId(jobId);

      // Update the job status to "assigned"
      const updateResult = await collection.updateOne(
        { _id: jobObjectId }, // Match job by jobId
        { $set: { status: "assigned", assignedAt: currentDate() , freelancerEmail: freelancerEmail} } // Set status to assigned and update timestamp
      );

      const userResult = await userCollection.updateOne(
        { email: freelancerEmail},
        {$set: {lookingForJob: false}}
      )
      // Check if the update was successful
      if (updateResult.modifiedCount === 0) {
        return res.status(404).json({ message: "Job not found or already assigned" });
      }

      res.status(200).json({ message: "Job status updated to assigned" });
    } else {
      res.status(400).json({ message: "Client not found" });
    }
  } catch (err) {
    console.error("Error during job assignment:", err);
    res.status(500).json({ message: "Failed to assign job" });
  }
};
