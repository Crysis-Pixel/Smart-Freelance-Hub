// routes/contracts.js
const express = require('express');
const router = express.Router();
const {
    createContract,
    updateContract,
    deleteContract,
    getAllContracts,
    getContractById
} = require('../controllers/contracts');

// Create a new contract
router.post('/create', createContract);

// Update an existing contract
router.put('/update', updateContract);

// Delete a contract by ID
router.delete('/delete', deleteContract);

// Get all contracts
router.get('/all', getAllContracts);

// Get a contract by ID
router.get('/get', getContractById);

module.exports = router;
