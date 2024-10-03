// controllers/jobs.js
const { getConnectedClient } = require('../database/db');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const db_name = process.env.DATABASE_NAME;
const collection_jobs = process.env.COLLECTION_JOBS;

exports.createJob = async (req, res) => {
    const { title, description, budget, deadline, status, clientId, skillsRequired } = req.body;

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_jobs);
        
        const result = await collection.insertOne({
            title,
            description,
            budget,
            deadline,
            status,
            clientId: new ObjectId(clientId), // Convert clientId to ObjectId
            creationDate: new Date(), // Set the current date
            skillsRequired,
        });

        res.status(201).json({ message: 'Job created successfully', jobId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create job'});
    }
};

exports.updateJob = async (req, res) => {
    const { id, title, description, budget, deadline, status, skillsRequired } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid job ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_jobs);

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { title, description, budget, deadline, status, skillsRequired } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ message: 'Job updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update job' });
    }
};

exports.deleteJob = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid job ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_jobs);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete job' });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_jobs);

        const jobs = await collection.find().toArray(); // Retrieve all jobs
        res.status(200).json(jobs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve jobs' });
    }
};

exports.getJobById = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid job ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_jobs);

        const job = await collection.findOne({ _id: new ObjectId(id) });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json(job);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve job' });
    }
};
