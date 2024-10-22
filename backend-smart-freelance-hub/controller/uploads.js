// controllers/uploads.js
require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Download file controller
exports.getAttachment = (req, res) => {
    const fileName = req.params.filename; // Get the filename from the route parameter
    const filePath = path.join(__dirname, '../uploads', fileName); // Construct the full path to the file

    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).send('File not found');
        }

        // Set the headers for file download
        res.download(filePath, (err) => {
            if (err) {
                res.status(500).send('Error downloading file');
            }
        });
    });
};