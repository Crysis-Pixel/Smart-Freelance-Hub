const bcrypt = require('bcrypt');
async function checkPassword(plainPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        if (match) {
            console.log('Password matches');
            return true;  // Password is correct
        } else {
            console.log('Password does not match');
            return false; // Password is incorrect
        }
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
}
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}
module.exports = {checkPassword, hashPassword};