// routes/jobs.js
const express = require('express');
const router = express.Router();

const {reviewUser} = require('../controller/reviews/reviewUser.js');
const {getReviews} = require('../controller/reviews/getReviews.js');
const {getUserReviews} = require('../controller/reviews/getUserReviews.js');

router.post('/reviewUser', reviewUser);
router.post('/getReviews', getReviews);
router.post('/getUserReviews', getUserReviews);

module.exports = router;