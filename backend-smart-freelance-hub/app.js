const express = require('express');
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb');
const client = require('./database/db').getConnectedClient;
const fs = require('fs');
const path = require('path');
const initializeSocket = require('./utils/socket');

const userRoutes = require('./routes/user');

//added by Mostakim
const jobsRoutes = require('./routes/jobs');
const proposalsRoutes = require('./routes/proposals');
const messagesRoutes = require('./routes/messages');
const portfoliosRoutes = require('./routes/portfolios');
const skillsRoutes = require('./routes/skills');
const transactionsRoutes = require('./routes/transactions');
const paymentsRoutes = require('./routes/payments');
const contractsRoutes = require('./routes/contracts');
const uploadRoutes = require('./routes/uploads')
//

const app = express()
app.use(cors({
    origin: '*',
    methods: '*'
}));
app.use(express.json());
const port = 3000

app.use('/user', userRoutes);
//Added by Mostakim
app.use('/jobs', jobsRoutes);
app.use('/proposals', proposalsRoutes);
app.use('/messages', messagesRoutes);
app.use('/portfolios', portfoliosRoutes);
app.use('/skills', skillsRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/payments', paymentsRoutes);
app.use('/contracts', contractsRoutes);
app.use('/uploads', uploadRoutes);
//

var connectionString = 'mongodb://localhost:27017';

/////////Added by Mostakim/////////////
const http = require('http');
const { send } = require('process');
const server = http.createServer(app); // Create an HTTP server

// Initialize Socket.IO
initializeSocket(server);

// Changed `app.listen` to `server.listen` so that it can handle Socket.IO
server.listen(port, async () => {
    console.log("Server running at port: ", port);
})

module.exports = client;
