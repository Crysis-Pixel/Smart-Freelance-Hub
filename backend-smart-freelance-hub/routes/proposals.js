// routes/proposals.js
const express = require('express');
const router = express.Router();
const {
    createProposal,
    updateProposal,
    deleteProposal,
    getAllProposals,
    getProposalById,
} = require('../controller/proposals');

// Create a new proposal
router.post('/create', createProposal);

// Update an existing proposal
router.put('/update', updateProposal);

// Delete a proposal by ID
router.delete('/delete/', deleteProposal);

// Get all proposals
router.get('/all', getAllProposals);

// Get a proposal by ID
router.get('/get', getProposalById);

module.exports = router;
