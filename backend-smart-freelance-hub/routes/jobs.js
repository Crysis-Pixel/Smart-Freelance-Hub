// routes/jobs.js
const express = require('express');
const router = express.Router();

const {postJob} = require('../controller/jobs/postJob');
const {getJobs} = require('../controller/jobs/getJobs');
const {assignJob} = require('../controller/jobs/assignJob');
const {cancelJob} = require('../controller/jobs/cancelJob');
const {editJob} = require('../controller/jobs/editJob');
const {jobPending} = require('../controller/jobs/jobPending');
const {declineJob} = require('../controller/jobs/declineJob');
const getFreelancerJob = require("../controller/jobs/freelancerJob");
const isReviewed = require("../controller/jobs/updateIsReviewed");
const {isPaid} = require("../controller/jobs/updateIsPaid");
const jobCompleted = require("../controller/jobs/jobCompleted");

router.post('/postJob', postJob);
router.post('/getJobs', getJobs);
router.post('/assignJob', assignJob);
router.post('/cancelJob', cancelJob);
router.post('/editJob', editJob);
router.post('/jobPending', jobPending);
router.post('/declineJob', declineJob);
router.post('/getFreelancerJob', getFreelancerJob.getFreelancerJob);
router.post('/getFreelancerCompletedJob', getFreelancerJob.getFreelancerCompletedJob);
router.post('/isClientReviewed', isReviewed.isClientReviewed);
router.post('/isFreelancerReviewed', isReviewed.isFreelancerReviewed);
router.post('/isPaid', isPaid);
router.post('/jobCompleted', jobCompleted.assignJob);



// const {
//     createJob,
//     updateJob,
//     deleteJob,
//     getAllJobs,
//     getJobById
// } = require('../controller/jobs');
// // Define the routes for job operations
// router.post('/create', createJob); // Create a new job
// router.put('/update', updateJob); // Update an existing job
// router.delete('/delete', deleteJob); // Delete a job
// router.get('/all', getAllJobs); // Get all jobs
// router.get('/get', getJobById); // Get a specific job by ID
module.exports = router;