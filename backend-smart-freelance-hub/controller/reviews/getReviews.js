const { getConnectedClient } = require("../../database/db");
require("dotenv").config();
const { findUserByEmail } = require("../../utils/findUserByEmail");
const { currentDate } = require("../../utils/date");

exports.getReviews = async (req, res) => {
    try {
      const client = getConnectedClient();
      const db = client.db(process.env.DATABASE_NAME);
      const collection = db.collection(process.env.COLLECTION_REVIEWS);
  
      // Fetch all reviews from the database
      const reviews = await collection.find().toArray();
  
      res.status(200).json(reviews); // Send the reviews back as a JSON response
    } catch (err) {
      res.status(500).json({ message: `Failed to fetch reviews: ${err.message}` });
    }
  };
