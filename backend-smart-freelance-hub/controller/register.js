const {getConnectedClient} = require('../database/db');
require('dotenv').config();
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.register = (req, res) => {
    const accountType = req.body.accountType;
    const name = req.body.name
    const email = req.body.email
    const passwordhash = req.body.passwordhash
    const bio = ""
    const skills = ""
    const rating = 0
    const totalEarnings = 0

    
try{
    client = getConnectedClient();
    var db = client.db(db_name);
    const collection =  db.collection(collection_users);
    const result =  collection.insertOne({
        accountType: accountType,
        name: name,
        email: email,
        passwordhash: passwordhash,
        bio: bio,
        skills: skills,
        rating: rating,
        totalEarnings: totalEarnings,
    });
    res.send(`${name} has been successfully registered`);
} catch (err) {
    res.send(`Fail registration`);
}
};