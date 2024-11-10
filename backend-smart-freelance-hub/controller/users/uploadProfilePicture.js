// File: routes/userRoutes.js
const multer = require("multer");
const { getConnectedClient } = require("../../database/db");
const { deleteFile } = require("../../utils/fileUtils");
const { ObjectId } = require("mongodb");
const path = require("path"); // Import path module
require("dotenv").config();

const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

// Configure storage to save files in an 'uploads/profile-pictures' directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile-pictures'); // Set destination folder
    },
    filename: (req, file, cb) => {
        // Set the filename format (e.g., user-email-timestamp.extension)
        const fileExt = path.extname(file.originalname);
        const fileName = `${req.body.email}-${Date.now()}${fileExt}`;
        cb(null, fileName);
    }
});
const upload = multer({ storage });

// Route to handle profile picture upload
exports.uploadProfilePicture = async (req, res) => {
    console.log("Uploading profile picture");
    upload.single("profilePicture")(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "Image upload failed." });
        }

        
        try {
            const { email } = req.body; // Identify the user by email
            const profilePicturePath = `/uploads/profile-pictures/${req.file.filename}`; // Relative path for storage
    
            // Build a URL to send back to the frontend
            const profilePictureUrl = `http://localhost:3000${profilePicturePath}`;
            
            const client = await getConnectedClient();
            const db = client.db(db_name);
            const users = db.collection(collection_users);

            // Get the current user's profile picture path
            const user = await users.findOne({ email });
            if (user?.profilePicture) {
                // Delete the old profile picture if it exists
                deleteFile(user.profilePicture);
            }

            // Update the user's profile picture path in the database
            await users.updateOne(
                { email: email },
                { $set: { profilePicture: profilePicturePath } }
            );

            res.status(200).json({
                message: "Profile picture updated successfully.",
                path: profilePictureUrl // Send the accessible URL
            });
        } catch (error) {
            console.error("Error updating profile picture:", error);
            res.status(500).json({ message: "Failed to update profile picture." });
        }
    });
};
