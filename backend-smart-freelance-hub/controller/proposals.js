// controllers/proposals.js
const { getConnectedClient } = require('../database/db');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const db_name = process.env.DATABASE_NAME;
const collection_proposals = process.env.COLLECTION_PROPOSALS;

exports.createProposal = async (req, res) => {
    const { jobId, freelancerId, bidAmount, deliveryTime, coverLetter } = req.body;

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_proposals);

        const newProposal = {
            jobId: new ObjectId(jobId), // Convert jobId to ObjectId
            freelancerId: new ObjectId(freelancerId), // Convert freelancerId to ObjectId
            bidAmount,
            createdAt: new Date(), // Set the current date
            status: 'Pending', // Set initial status
            deliveryTime,
            coverLetter, // Optional file
        };

        const result = await collection.insertOne(newProposal);

        res.status(201).json({ message: 'Proposal created successfully', proposalId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create proposal' });
    }
};

exports.updateProposal = async (req, res) => {
    const { id, jobId, freelancerId, bidAmount, deliveryTime, status } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid proposal ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_proposals);

        const updateData = {
            jobId: jobId ? new ObjectId(jobId) : undefined, // Convert jobId to ObjectId if provided
            freelancerId: freelancerId ? new ObjectId(freelancerId) : undefined, // Convert freelancerId to ObjectId if provided
            bidAmount,
            deliveryTime,
            status,
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Proposal not found' });
        }

        res.status(200).json({ message: 'Proposal updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update proposal' });
    }
};

exports.deleteProposal = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid proposal ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_proposals);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Proposal not found' });
        }

        res.status(200).json({ message: 'Proposal deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete proposal' });
    }
};

exports.getAllProposals = async (req, res) => {
    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_proposals);

        const proposals = await collection.find({}).toArray();

        res.status(200).json(proposals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve proposals' });
    }
};

exports.getProposalById = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid proposal ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_proposals);

        const proposal = await collection.findOne({ _id: new ObjectId(id) });

        if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }

        res.status(200).json(proposal);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve proposal' });
    }
};
