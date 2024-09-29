const {getConnectedClient} = require('../database/db');


exports.register = (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    
try{
    client = getConnectedClient();
    var db = client.db("Smart-Freelance-Hub");
    const collection =  db.collection("Freelancers");
    const result =  collection.insertOne({
        username: username,
        email: email,
        password: password,
    });
    res.send(`${username} has been successfully registered`);
} catch (err) {
    res.send(`Fail registration`);
}
    

};