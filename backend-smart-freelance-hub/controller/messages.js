// controllers/messages.js
const { getConnectedClient } = require('../database/db');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const db_name = process.env.DATABASE_NAME;
const collection_messages = process.env.COLLECTION_MESSAGES;

// Create a new message
exports.createMessage = async (req, res) => {
    const { senderId, receiverId, messageText, isRead } = req.body;
    const attachment = req.file ? req.file.filename : null; // Handle file attachment

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_messages);

        const newMessage = {
            senderId,
            receiverId,
            messageText,
            attachment,
            timestamp: new Date(),
            isRead: false // Initialize with unread status
        };

        const result = await collection.insertOne(newMessage);

        res.status(201).json({ message: 'Message sent successfully', lastId: result.insertedId, attachmentName: attachment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// Update an existing message
exports.updateMessage = async (req, res) => {
    const { id, attachment, messageText } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid message ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_messages);

        const updateData = {
            attachment: attachment || undefined, // Optional attachment
            messageText, // Update message text
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update message' });
    }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid message ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_messages);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete message' });
    }
};

// Get all messages (for admin or debugging)
exports.getAllMessages = async (req, res) => {
    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_messages);

        const messages = await collection.find({}).toArray();

        res.status(200).json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};

// Get chat messages between two users
exports.getMessages = async (req, res) => {
    const { userId, recipientId } = req.body;

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_messages);

        const messages = await collection.find({
            $or: [
                { senderId: userId, receiverId: recipientId },
                { senderId: recipientId, receiverId: userId }
            ]
        }).sort({ timestamp: 1 }).toArray();

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

// Mark a message as read
exports.markAsRead = async (req, res) => {
    const { id } = req.body;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid message ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_messages);

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { isRead: true } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message marked as read' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to mark message as read' });
    }
};
