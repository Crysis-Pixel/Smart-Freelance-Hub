const express = require('express');
const router = express.Router();

const {register} = require('../controller/users/register');
const {login} = require('../controller/users/login');
const {verifyOTP} = require('../controller/users/otp/verifyOTP');
const {resendOTP} = require('../controller/users/otp/resendOTP');
const { updateuser } = require('../controller/users/updateuser');
const { deleteUser } = require('../controller/deleteuser');
const { getUsers } = require('../controller/getusers');
const { getUser } = require('../controller/users/getUser');
const { getUserById } = require('../controller/getuserbyid');

//Added by Mostakim
const { checkUserEmail } = require('../controller/users/checkUserEmail')
//

router.post('/register', register);
router.post('/login', login);

router.get('/getUser', getUser);

router.post('/updateUser', updateuser);

router.delete('/delete', deleteUser);
router.get('/getUsers', getUsers);
router.get('/getUserById', getUserById);

//OTP routes
router.post('/resendOTP', resendOTP);
router.post('/verifyOTP', verifyOTP);

//Added by Mostakim
router.post('/checkUserEmail', checkUserEmail);
//

module.exports = router;