// routes/deleteuser.js
const express = require('express');
const router = express.Router();
const { deleteUser } = require('../controller/deleteuser');

// Define the DELETE route for deleting a user
router.delete('/', deleteUser); // No ID in the URL, handled in the request body

module.exports = router;
