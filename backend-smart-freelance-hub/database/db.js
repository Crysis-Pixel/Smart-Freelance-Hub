const MongoClient = require("mongodb").MongoClient;
require('dotenv').config();
const url = process.env.DATABASE_URL;

const databaseName = process.env.DATABASE_NAME;

let client;

async function connect() {
    if (!client) {
        try{
            client = await MongoClient.connect(url)
        }
        catch(err){ console.log(err); };
    }
    return client;
}

const getConnectedClient = () => {
    return client;
}

const testConnection = connect()
    .then((connection) => console.log("connected to DB"));


module.exports = { connect, getConnectedClient };
