// controllers/contracts.js
const { getConnectedClient } = require('../database/db');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const db_name = process.env.DATABASE_NAME;
const collection_contracts = process.env.COLLECTION_CONTRACTS;

exports.createContract = async (req, res) => {
    const { 
        clientFeedback, 
        freelancerFeedback, 
        clientRating, 
        freelancerRating, 
        startDate, 
        endDate, 
        status, 
        freelancerId, 
        clientId, 
        jobId 
    } = req.body;

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_contracts);

        const newContract = {
            clientFeedback,
            freelancerFeedback,
            clientRating,
            freelancerRating,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            status,
            freelancerId: new ObjectId(freelancerId),
            clientId: new ObjectId(clientId),
            jobId: new ObjectId(jobId)
        };

        const result = await collection.insertOne(newContract);

        res.status(201).json({ message: 'Contract created successfully', contractId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create contract' });
    }
};

exports.updateContract = async (req, res) => {
    const { id, clientFeedback, freelancerFeedback, clientRating, freelancerRating, startDate, endDate, status, freelancerId, clientId, jobId } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid contract ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_contracts);

        const updateData = {
            clientFeedback,
            freelancerFeedback,
            clientRating,
            freelancerRating,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            status,
            freelancerId: new ObjectId(freelancerId),
            clientId: new ObjectId(clientId),
            jobId: new ObjectId(jobId)
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        res.status(200).json({ message: 'Contract updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update contract' });
    }
};

exports.deleteContract = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid contract ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_contracts);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        res.status(200).json({ message: 'Contract deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete contract' });
    }
};

exports.getAllContracts = async (req, res) => {
    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_contracts);

        const contracts = await collection.find({}).toArray();

        res.status(200).json(contracts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve contracts' });
    }
};

exports.getContractById = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid contract ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_contracts);

        const contract = await collection.findOne({ _id: new ObjectId(id) });

        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        res.status(200).json(contract);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve contract' });
    }
};
