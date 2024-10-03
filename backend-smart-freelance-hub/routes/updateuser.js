const express = require('express');
const router = express.Router();
const { updateuser } = require('../controller/updateuser'); // Adjust the path based on your folder structure

// Route for updating a user
router.put('/', updateuser); // No ID in the URL, handled in the request body

module.exports = router;
