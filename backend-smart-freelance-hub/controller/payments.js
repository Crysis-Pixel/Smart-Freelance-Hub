// controllers/payments.js
const { getConnectedClient } = require('../database/db');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const db_name = process.env.DATABASE_NAME;
const collection_payments = process.env.COLLECTION_PAYMENTS;

exports.createPayment = async (req, res) => {
    const { bankName, paymentMethod, userId } = req.body;

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_payments);

        const newPayment = {
            bankName,
            paymentMethod,
            userId: (userId)  // Convert userId to ObjectId
        };

        const result = await collection.insertOne(newPayment);

        res.status(201).json({ message: 'Payment created successfully', paymentId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create payment' });
    }
};

exports.updatePayment = async (req, res) => {
    const { id, bankName, paymentMethod, userId } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid payment ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_payments);

        const updateData = {
            bankName,
            paymentMethod,
            userId: (userId)  // Convert userId to ObjectId
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({ message: 'Payment updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update payment' });
    }
};

exports.deletePayment = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid payment ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_payments);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete payment' });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_payments);

        const payments = await collection.find({}).toArray();

        res.status(200).json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve payments' });
    }
};

exports.getPaymentById = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid payment ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_payments);

        const payment = await collection.findOne({ _id: new ObjectId(id) });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve payment' });
    }
};
