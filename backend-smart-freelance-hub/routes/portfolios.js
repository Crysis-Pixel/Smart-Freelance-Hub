// routes/portfolios.js
const express = require('express');
const router = express.Router();
const {
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    getAllPortfolios,
    getPortfolioById,
} = require('../controller/portfolios');

// Create a new portfolio
router.post('/create', createPortfolio);

// Update an existing portfolio
router.put('/update', updatePortfolio);

// Delete a portfolio by ID
router.delete('/delete', deletePortfolio);

// Get all portfolios
router.get('/all', getAllPortfolios);

// Get a portfolio by ID
router.get('/get', getPortfolioById);

module.exports = router;
