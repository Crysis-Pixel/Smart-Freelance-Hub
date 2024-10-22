const { getConnectedClient } = require("../../database/db");
require("dotenv").config();
const { emailExist } = require("../../utils/emailExist");
const { checkPassword, hashedPassword } = require("../../utils/password");
const {findUserByEmail} = require("../../utils/findUserByEmail");
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.changeUserPassword = async (req, res) => {
  const { email, password, newPassword } = req.body;
  try {
    // Find user by email
    const user = await findUserByEmail(email);

    // Check if user was found
    if (user && user.hashedPassword) {
      // Verify the password
      if (await checkPassword(password, user.hashedPassword)) {
        // User authenticated
        if(newPassword === password) {
          return res.status(500).json({ message: "Cannot use old password" });
        }
        // Hash the new password
        const hashedNewPassword = await hashedPassword(newPassword);
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_users);
        // Update user password
        await collection.updateOne(
          { email },
          { $set: { hashedPassword: hashedNewPassword } }
        );
        console.log("User password updated successfully");
        return res.status(200).json({ message: "Success" });
      }
    }

    // If user not found or password incorrect
    res.status(500).json({ message: "Wrong Password" });
  } catch (err) {
    console.error("Error during password change:", err);
    res.status(500).json({ message: "Password change failed" });
  }
};
