// controllers/portfolios.js
const { getConnectedClient } = require('../database/db');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const db_name = process.env.DATABASE_NAME;
const collection_portfolios = process.env.COLLECTION_PORTFOLIOS;

exports.createPortfolio = async (req, res) => {
    const { freelancerId, title, description, attachments } = req.body;

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_portfolios);

        const newPortfolio = {
            freelancerId: (freelancerId), // Convert freelancerId to ObjectId
            title,
            description,
            attachments, // Optional file attached to the portfolio
            createdAt: new Date(), // Set the current date
        };

        const result = await collection.insertOne(newPortfolio);

        res.status(201).json({ message: 'Portfolio created successfully', portfolioId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create portfolio' });
    }
};

exports.updatePortfolio = async (req, res) => {
    const { id, title, description, attachments } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid portfolio ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_portfolios);

        const updateData = {
            title,
            description,
            attachments: attachments || undefined, // Optional file
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.status(200).json({ message: 'Portfolio updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update portfolio' });
    }
};

exports.deletePortfolio = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid portfolio ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_portfolios);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.status(200).json({ message: 'Portfolio deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete portfolio' });
    }
};

exports.getAllPortfolios = async (req, res) => {
    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_portfolios);

        const portfolios = await collection.find({}).toArray();

        res.status(200).json(portfolios);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve portfolios' });
    }
};

exports.getPortfolioById = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid portfolio ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_portfolios);

        const portfolio = await collection.findOne({ _id: new ObjectId(id) });

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.status(200).json(portfolio);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve portfolio' });
    }
};
