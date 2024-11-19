const { getConnectedClient } = require("../../database/db");
require("dotenv").config();
const { findUserByEmail } = require("../../utils/findUserByEmail");
const { currentDate } = require("../../utils/date");

exports.reviewUser = async (req, res) => {
    const { emailOfReviewer, emailOfReviewed, description, reviewedType } = req.body;
    const rating = parseFloat(req.body.rating);
    console.log("Attempting to post review");

    let client;
    try {
        const user = await findUserByEmail(emailOfReviewer);
        const user2 = await findUserByEmail(emailOfReviewed);

        if (!user || !user2) {
            return res.status(400).json({ message: 'User(s) not found' });
        }

        client = await getConnectedClient();
        const db = client.db(process.env.DATABASE_NAME);
        const reviewsCollection = db.collection(process.env.COLLECTION_REVIEWS);
        const usersCollection = db.collection(process.env.COLLECTION_USERS);

        // Insert review
        const newReview = {
            emailOfReviewer,
            emailOfReviewed,
            rating,
            description,
            reviewDate: currentDate(),
            reviewedType,
        };

        const reviewResult = await reviewsCollection.insertOne(newReview);

        if (!reviewResult.insertedId) {
            throw new Error("Failed to insert review");
        }

        // Determine field to update based on reviewedType
        const updateField = reviewedType === "F" ? "fRating" : reviewedType === "C" ? "cRating" : null;

        if (!updateField) {
            await reviewsCollection.deleteOne({ _id: reviewResult.insertedId });
            throw new Error("Invalid reviewedType; review insertion rolled back");
        }

        // Confirm the existence of user before updating rating
        const userToUpdate = await usersCollection.findOne({ email: emailOfReviewed });

        if (!userToUpdate) {
            await reviewsCollection.deleteOne({ _id: reviewResult.insertedId });
            throw new Error("User not found for rating update; review insertion rolled back");
        }
        
        // Retrieve and calculate the new average rating
        const numberOfReviews = reviewedType === "F" ? userToUpdate.numberOfFreelancerReviews : reviewedType === "C" ? userToUpdate.numberOfClientReviews : 0;
        const existingRating = userToUpdate[updateField] || 0;
        const newNumberOfReviews = numberOfReviews + 1;
        console.log(newNumberOfReviews);
        console.log(existingRating + "*" + numberOfReviews + "+" + rating + "/" + newNumberOfReviews);
        let updatedRating = (existingRating * numberOfReviews + rating) / (parseInt(newNumberOfReviews));
        updatedRating = Math.round(updatedRating * 10) / 10
        console.log(updatedRating);
        // Update user rating and increment review count
        let userUpdateResult;
        if(reviewedType == "F"){
            userUpdateResult = await usersCollection.updateOne(
                { email: emailOfReviewed },
                {
                    $set: { [updateField]: updatedRating },
                    $inc: { numberOfFreelancerReviews: 1 }
                }
            );
        } else if (reviewedType === "C"){
            userUpdateResult = await usersCollection.updateOne(
                { email: emailOfReviewed },
                {
                    $set: { [updateField]: updatedRating },
                    $inc: { numberOfClientReviews: 1 }
                }
            );
        } else{
            await reviewsCollection.deleteOne({ _id: reviewResult.insertedId });
            throw new Error("Invalid reviewedType; review insertion rolled back");
        }

        // Roll back the review if the rating update fails
        if (!userUpdateResult) {
            await reviewsCollection.deleteOne({ _id: reviewResult.insertedId });
            throw new Error("Failed to update user rating; review insertion rolled back");
        }

        console.log("Review posted successfully");
        res.status(200).json({ message: "Review posted successfully" });
    } catch (err) {
        console.error("Error during review post:", err);
        res.status(500).json({ message: "Review post failed" });
    }
};
