// routes/otpRoutes.js
const express = require('express');
const router = express.Router();
const mailController = require('../controller/mailMessage');

router.post('/', mailController.mailMessage);

module.exports = router;
