// routes/transactions.js
const express = require('express');
const router = express.Router();
const {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getAllTransactions,
    getTransactionById,
} = require('../controller/transactions');

// Create a new transaction
router.post('/create', createTransaction);

// Update an existing transaction
router.put('/update', updateTransaction);

// Delete a transaction by ID
router.delete('/delete', deleteTransaction);

// Get all transactions
router.get('/all', getAllTransactions);

// Get a transaction by ID
router.get('/get', getTransactionById);

module.exports = router;
