// routes/getUsers.js
const express = require('express');
const router = express.Router();
const { getUsers } = require('../controller/getusers');

// Define the GET route for retrieving all users
router.get('/', getUsers); // Handle GET requests to /users

module.exports = router;
