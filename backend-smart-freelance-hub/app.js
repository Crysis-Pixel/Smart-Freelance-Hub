const express = require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const multer = require('multer');
const client = require('./database/db').getConnectedClient;
const routes = require('./routes/register');

const app = express()
app.use(cors({
    origin: '*',
    methods: '*'
}));
app.use(express.json());

const port = 3000

app.use('/register', routes);
var connectionString = 'mongodb://localhost:27017';

app.listen(port, async () => {
    console.log("Server running at port: ", port);
})

module.exports = client;
