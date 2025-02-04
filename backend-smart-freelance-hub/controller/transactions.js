// controllers/transactions.js
const { getConnectedClient } = require('../database/db');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const db_name = process.env.DATABASE_NAME;
const collection_transactions = process.env.COLLECTION_TRANSACTIONS;

exports.createTransaction = async (req, res) => {
    const { contractId, paymentId, amount} = req.body;

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_transactions);

        const newTransaction = {
            status: "Incomplete",
            contractId, // contractId can be null
            paymentId, // Convert paymentId to ObjectId
            amount,
            date: new Date(),
        };

        const result = await collection.insertOne(newTransaction);

        res.status(201).json({ message: 'Transaction created successfully', transactionId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
};

exports.updateTransaction = async (req, res) => {
    const { _id, status} = req.body;

    if (!ObjectId.isValid(_id)) {
        return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_transactions);

        const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: {status: status} }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
};

exports.deleteTransaction = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_transactions);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_transactions);

        const transactions = await collection.find({}).toArray();

        res.status(200).json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve transactions' });
    }
};

exports.getTransactionById = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_transactions);

        const transaction = await collection.findOne({ _id: new ObjectId(id) });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json(transaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve transaction' });
    }
};
