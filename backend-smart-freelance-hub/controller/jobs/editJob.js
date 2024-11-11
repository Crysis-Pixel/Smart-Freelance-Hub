const { getConnectedClient } = require("../../database/db");
require("dotenv").config();
const { findUserByEmail } = require("../../utils/findUserByEmail");
const { currentDate } = require("../../utils/date");
const { ObjectId} = require("mongodb")

exports.editJob = async (req, res) => {
  // Extract jobId and clientEmail from the request body
  const { title, description, requirements, jobId, maxBudget, clientEmail } = req.body;

  try {
    // Find user by email
    const user = await findUserByEmail(clientEmail);

    // Check if user was found
    if (user) {
      // Connect to the database
      const client = await getConnectedClient();
      const db = client.db(process.env.DATABASE_NAME);
      const collection = db.collection(process.env.COLLECTION_JOBS);

      // Convert jobId to ObjectId
      const jobObjectId = new ObjectId(jobId);

      const findJob = await collection.findOne(jobObjectId);
      if (findJob.status !== 'unassigned') { 
        return res.status(404).json({ message: "assigned job cannot be modified" });
      }

      const updatedJob = {
        status: 'unassigned',
        title : title,
        description : description,
        requirements : requirements,
        createdAt: currentDate(),
        maxBudget : maxBudget,
      };
      // Update the job status to "assigned"
      const updateResult = await collection.updateOne(
        { _id: jobObjectId }, // Match job by jobId
        { $set: updatedJob } // Set status to assigned and update timestamp
      );

      res.status(200).json({ message: "Job info updated" });
    } else {
      res.status(400).json({ message: "Client not found" });
    }
  } catch (err) {
    console.error("Error during job assignment:", err);
    res.status(500).json({ message: "Failed to assign job" });
  }
};
