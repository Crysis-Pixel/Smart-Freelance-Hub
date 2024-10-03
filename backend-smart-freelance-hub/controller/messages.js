// controllers/messages.js
const { getConnectedClient } = require('../database/db');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const db_name = process.env.DATABASE_NAME;
const collection_messages = process.env.COLLECTION_MESSAGES;

exports.createMessage = async (req, res) => {
    const { senderId, receiverId, attachment, messageText } = req.body;

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_messages);

        const newMessage = {
            senderId: (senderId), // Convert senderId to ObjectId
            receiverId: (receiverId), // Convert receiverId to ObjectId
            attachment, // Optional file sent with the message
            timestamp: new Date(), // Set the current date
            messageText,
        };

        const result = await collection.insertOne(newMessage);

        res.status(201).json({ message: 'Message sent successfully', messageId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

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

exports.getMessageById = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid message ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_messages);

        const message = await collection.findOne({ _id: new ObjectId(id) });

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve message' });
    }
};
