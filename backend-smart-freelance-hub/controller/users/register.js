const { getConnectedClient } = require("../../database/db");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { isUserActive, currentDate } = require("../../utils/date");
const {generateOTP, sendOTP} = require("../../utils/otp");
const {emailExist} = require("../../utils/emailExist");
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.register = async (req, res) => {
  // extract data from request body
  const accountType = req.body.accountType;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const country = req.body.country;
  const phoneNumber = req.body.phoneNumber;
  const bio = "";
  const skills = "";
  const rating = 0;
  const totalEarnings = 0;
  const lastActive = currentDate();
  const jobsCompleted = 0;
  const profilePicture = "";
  const accountCreated = currentDate();

  try {
    //email already exists check
    if (await emailExist(email) == true) {
      throw new Error("Email already exists");
    }
    // password hashing
    let hashedPassword = "";
    if (password != "") {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    }

    // Generate OTP
    const otp = generateOTP();

    // connect to database
    client = getConnectedClient();
    var db = client.db(db_name);
    const collection = db.collection(collection_users);
    const result = collection.insertOne({
      accountType: accountType,
      firstName: firstName,
      lastName: lastName,
      email: email,
      hashedPassword: hashedPassword, //replace with hashedPassword or password for testing
      country: country,
      phoneNumber: phoneNumber,
      bio: bio,
      skills: skills,
      rating: rating,
      totalEarnings: totalEarnings,
      lastActive: lastActive,
      jobsCompleted: jobsCompleted,
      profilePicture: profilePicture,
      accountCreated: accountCreated,
      otp, // storing OTP for later verification
      otpExpires: Date.now() + 15 * 60 * 1000, // OTP expiration time (15 minutes)
      isVerified: false, // mark user as not verified yet
    });
    // Send OTP to user email
    try {
      await sendOTP(email, otp);
    } catch (error) {
      console.log("OTP fail");
    }

    console.log("registration success");
    res.status(200).json({ message: "Success" });
  } catch (err) {
    console.log("registration fail");
    res.status(500).json({ message: "Fail registration" });
  }
};

