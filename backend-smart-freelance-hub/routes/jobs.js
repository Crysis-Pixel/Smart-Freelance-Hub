// routes/jobs.js
const express = require('express');
const router = express.Router();
const {
    createJob,
    updateJob,
    deleteJob,
    getAllJobs,
    getJobById
} = require('../controller/jobs');

// Define the routes for job operations
router.post('/create', createJob); // Create a new job
router.put('/update', updateJob); // Update an existing job
router.delete('/delete', deleteJob); // Delete a job
router.get('/all', getAllJobs); // Get all jobs
router.get('/get', getJobById); // Get a specific job by ID

module.exports = router;
