const {getConnectedClient} = require('../database/db');
require('dotenv').config();
const {isUserActive, currentDate} = require('../utils/date');
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.register = (req, res) => {
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
    client = getConnectedClient();
    var db = client.db(db_name);
    const collection =  db.collection(collection_users);
    const result =  collection.insertOne({
        accountType: accountType,
        firstName: firstName,
        lastName: lastName,
        email: email,
        passwordhash: password,
        country: country,
        phoneNumber: phoneNumber,
        bio: bio,
        skills: skills,
        rating: rating,
        totalEarnings: totalEarnings,
        lastActive: currentDate(),
        isActive: isActive,
    });
    
    res.json({ message: 'Success'});
    isUserActive();
    
} catch (err) {
    res.send(`Fail registration`);
}
};