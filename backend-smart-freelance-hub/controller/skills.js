// controllers/skills.js
const { getConnectedClient } = require('../database/db');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const db_name = process.env.DATABASE_NAME;
const collection_skills = process.env.COLLECTION_SKILLS;

exports.createSkill = async (req, res) => {
    const { name, experience, freelancerId } = req.body;

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_skills);

        const newSkill = {
            name,
            experience,
            freelancerId: (freelancerId), // Convert freelancerId to ObjectId
        };

        const result = await collection.insertOne(newSkill);

        res.status(201).json({ message: 'Skill created successfully', skillId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create skill' });
    }
};

exports.updateSkill = async (req, res) => {
    const { id, name, experience } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid skill ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_skills);

        const updateData = {
            name,
            experience,
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        res.status(200).json({ message: 'Skill updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update skill' });
    }
};

exports.deleteSkill = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid skill ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_skills);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        res.status(200).json({ message: 'Skill deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete skill' });
    }
};

exports.getAllSkills = async (req, res) => {
    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_skills);

        const skills = await collection.find({}).toArray();

        res.status(200).json(skills);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve skills' });
    }
};

exports.getSkillById = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid skill ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_skills);

        const skill = await collection.findOne({ _id: new ObjectId(id) });

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        res.status(200).json(skill);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve skill' });
    }
};
