// routes/skills.js
const express = require('express');
const router = express.Router();
const {
    createSkill,
    updateSkill,
    deleteSkill,
    getAllSkills,
    getSkillById,
} = require('../controller/skills');

// Create a new skill
router.post('/create', createSkill);

// Update an existing skill
router.put('/update', updateSkill);

// Delete a skill by ID
router.delete('/delete', deleteSkill);

// Get all skills
router.get('/all', getAllSkills);

// Get a skill by ID
router.get('/get', getSkillById);

module.exports = router;
