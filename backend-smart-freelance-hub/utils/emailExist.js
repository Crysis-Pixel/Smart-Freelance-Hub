const { getConnectedClient } = require("../database/db");
require("dotenv").config();
const db_name = process.env.DATABASE_NAME;
const collection_users = process.env.COLLECTION_USERS;
async function emailExist(email) {
    try {
      const client = getConnectedClient();
      const db = client.db(db_name);
      const collection = db.collection(collection_users);
  
      const user = await collection.findOne({ email });
  
      if (user) {
        console.log(`This email: ${email} exists in DB`);
        return true;
      } else {
        console.log(`This email: ${email} does not exist in DB`);
        return false;
      }
    } catch (err) {
      console.error(err);
    }
}
module.exports = {emailExist};