const express = require('express');
const router = express.Router();

const {register} = require('../controller/register');
const { updateuser } = require('../controller/updateuser');
const { deleteUser } = require('../controller/deleteuser');
const { getUsers } = require('../controller/getusers');
const { getUserById } = require('../controller/getuserbyid');

router.post('/register', register);
router.post('/update', updateuser);
router.delete('/delete', deleteUser);
router.get('/getUsers', getUsers);
router.get('/getUserById', getUserById);

module.exports = router;