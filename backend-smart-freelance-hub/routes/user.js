const express = require('express');
const router = express.Router();

const {register} = require('../controller/register');
const {login} = require('../controller/login');
const {verifyOTP} = require('../controller/verifyOTP');
const { updateuser } = require('../controller/updateuser');
const { deleteUser } = require('../controller/deleteuser');
const { getUsers } = require('../controller/getusers');
const { getUserById } = require('../controller/getuserbyid');

//Added by Mostakim
const { checkUserEmail } = require('../controller/checkUserEmail')
//

router.post('/register', register);
router.post('/login', login);
router.post('/login', verifyOTP);
router.post('/update', updateuser);
router.delete('/delete', deleteUser);
router.get('/getUsers', getUsers);
router.get('/getUserById', getUserById);

//Added by Mostakim
router.post('/checkUserEmail', checkUserEmail);
//

module.exports = router;