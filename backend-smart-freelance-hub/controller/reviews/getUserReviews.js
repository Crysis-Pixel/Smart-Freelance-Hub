const { getConnectedClient } = require("../../database/db");
require("dotenv").config();
const { findUserByEmail } = require("../../utils/findUserByEmail");

exports.getUserReviews = async (req, res) => {
  const { email, reviewedType } = req.body; // Expect email in request body

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const client = getConnectedClient();
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection(process.env.COLLECTION_REVIEWS);

    // Fetch reviews for the specified user by email
    const userReviews = await collection
      .find({ emailOfReviewed: email, reviewedType: reviewedType }).toArray();

    if (userReviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this user" });
    }
    
    res.status(200).json(userReviews); // Send the user-specific reviews back as JSON
  } catch (err) {
    res.status(500).json({ message: `Failed to fetch user reviews: ${err.message}` });
  }
};
