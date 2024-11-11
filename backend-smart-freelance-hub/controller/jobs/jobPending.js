const { getConnectedClient } = require("../../database/db");
require("dotenv").config();
const { findUserByEmail } = require("../../utils/findUserByEmail");
const { currentDate } = require("../../utils/date");
const { ObjectId } = require("mongodb"); // Import ObjectId

exports.jobPending = async (req, res) => {
  // Extract jobId and clientEmail from the request body
  const { jobId, clientEmail, freelancerEmail, offeredPrice } = req.body;

  try {
    // Find user by email
    const user = await findUserByEmail(clientEmail);
    const user2 = await findUserByEmail(freelancerEmail);

    // Check if user was found
    if (user && user2) {
      // Connect to the database
      const client = await getConnectedClient();
      const db = client.db(process.env.DATABASE_NAME);
      const collection = db.collection(process.env.COLLECTION_JOBS);

      // Convert jobId to ObjectId
      const jobObjectId = new ObjectId(jobId);

      // Update the job status to "completed"
      const updateResult = await collection.updateOne(
        { _id: jobObjectId }, // Match job by jobId
        { $set: { status: "pending", freelancerEmail: freelancerEmail, 
          "offeredPrice" : offeredPrice
        } } // Set status to pending
      );

      // Check if the update was successful
      if (updateResult.modifiedCount === 0) {
        return res.status(404).json({ message: "Job not found or already pending" });
      }

      res.status(200).json({ message: "Job status updated to pending" });
    } else {
      res.status(400).json({ message: "Client not found" });
    }
  } catch (err) {
    console.error("Error during job pending:", err);
    res.status(500).json({ message: "Failed to update pending job" });
  }
};
