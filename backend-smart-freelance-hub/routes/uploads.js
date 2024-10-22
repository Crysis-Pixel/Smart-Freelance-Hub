const express = require('express');
const router = express.Router();
const {
    getAttachment
} = require('../controller/uploads');

// Define the download route
router.get('/:filename', getAttachment);

module.exports = router;