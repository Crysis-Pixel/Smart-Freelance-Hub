const {getConnectedClient} = require('../database/db');
require('dotenv').config();
const bcrypt = require('bcrypt');
const {isUserActive, currentDate} = require('../utils/date');
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.register = async(req, res) => {
    // extract data from request body
    const accountType = req.body.accountType;
    console.log(req.body.accountType);
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const password = req.body.password
    const country = req.body.country
    const phoneNumber = req.body.phoneNumber
    const bio = ""
    const skills = ""
    const rating = 0
    const totalEarnings = 0
    const isActive = true

try{
    // password hashing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // connect to database
    client = getConnectedClient();
    var db = client.db(db_name);
    const collection =  db.collection(collection_users);
    const result =  collection.insertOne({
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
        lastActive: currentDate(),
        jobsCompleted: 0,
        profilePicture:"",
    });
    
    res.json({ message: 'Success'});
    isUserActive();
    
} catch (err) {
    console.log(err);
    res.send(`Fail registration`);
}
};