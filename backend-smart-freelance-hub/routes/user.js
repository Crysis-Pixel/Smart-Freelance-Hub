const express = require('express');
const router = express.Router();

const {register} = require('../controller/users/register');
const {login} = require('../controller/users/login');
const {verifyOTP} = require('../controller/users/otp/verifyOTP');
const {resendOTP} = require('../controller/users/otp/resendOTP');
const { updateUser, updateUserBalance } = require('../controller/users/updateuser');
const { updateUserAccountType } = require('../controller/users/updateUserAccountType');
const { changeUserPassword } = require('../controller/users/changeUserPassword');
const { deleteUser } = require('../controller/deleteuser');
const { getUsers } = require('../controller/getusers');
const { getUser } = require('../controller/users/getUser');
const { getUserById } = require('../controller/getuserbyid');

//Added by Mostakim
const { checkUserEmail } = require('../controller/users/checkUserEmail')
//

router.post('/register', register);
router.post('/login', login);

router.post('/getUser', getUser);

router.post('/updateUser', updateUser);
router.post('/updateUserBalance', updateUserBalance);
router.post('/updateUserAccountType', updateUserAccountType);
router.post('/changeUserPassword', changeUserPassword);

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