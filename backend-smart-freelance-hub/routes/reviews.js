// routes/jobs.js
const express = require('express');
const router = express.Router();

const {reviewUser} = require('../controller/reviews/reviewUser.js');

router.post('/reviewUser', reviewUser);

module.exports = router;