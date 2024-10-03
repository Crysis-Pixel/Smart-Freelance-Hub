// routes/messages.js
const express = require('express');
const router = express.Router();
const {
    createMessage,
    updateMessage,
    deleteMessage,
    getAllMessages,
    getMessageById,
} = require('../controller/messages');

// Create a new message
router.post('/create', createMessage);

// Update an existing message
router.put('/update', updateMessage);

// Delete a message by ID
router.delete('/delete', deleteMessage);

// Get all messages
router.get('/all', getAllMessages);

// Get a message by ID
router.get('/get', getMessageById);

module.exports = router;
