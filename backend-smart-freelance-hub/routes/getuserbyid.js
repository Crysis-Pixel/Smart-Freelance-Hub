// routes/getUserById.js
const express = require('express');
const router = express.Router();
const { getUserById } = require('../controller/getuserbyid');

router.get('/', getUserById);

module.exports = router;
