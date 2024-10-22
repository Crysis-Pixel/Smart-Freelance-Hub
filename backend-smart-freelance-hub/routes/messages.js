// routes/messages.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    createMessage,
    updateMessage,
    deleteMessage,
    getAllMessages,
    getMessages,
    markAsRead
} = require('../controller/messages');

// Configured multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Create a new message (with optional attachment)
router.post('/create', upload.single('attachment'), createMessage);

// Update an existing message
router.put('/update', upload.single('attachment'), updateMessage);

// Delete a message by ID
router.delete('/delete', deleteMessage);

// Get all messages (for debugging or admin purposes)
router.post('/all', getAllMessages);

// Get chat messages between two users
router.post('/getMessages', getMessages);

// Mark a message as read
router.put('/markAsRead', markAsRead);

module.exports = router;
