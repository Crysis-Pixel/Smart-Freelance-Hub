// routes/payments.js
const express = require('express');
const router = express.Router();
const {
    createPayment,
    updatePayment,
    deletePayment,
    getAllPayments,
    getPaymentById
} = require('../controller/payments');

// Create a new payment
router.post('/create', createPayment);

// Update an existing payment
router.put('/update', updatePayment);

// Delete a payment by ID
router.delete('/delete', deletePayment);

// Get all payments
router.get('/all', getAllPayments);

// Get a payment by ID
router.get('/get', getPaymentById);

module.exports = router;
