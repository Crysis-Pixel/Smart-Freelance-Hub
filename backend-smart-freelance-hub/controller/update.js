const {getConnectedClient} = require('../database/db');
require('dotenv').config();
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;

exports.update = async (req, res) => {
    const bio = req.body.bio

    
try{
    client = getConnectedClient();
    var db = client.db(db_name);
    const collection =  db.collection(collection_users);
    const result =  collection.find({"username" : "Jim"})
    for await (const doc of result) {
        doc["bio"] = bio
        console.log(doc)
    }
    const ree = collection.updateOne({"bio" : bio});
    res.send(`${username} has been successfully registered`);
} catch (err) {
    res.send(`Fail registration`);
}
};