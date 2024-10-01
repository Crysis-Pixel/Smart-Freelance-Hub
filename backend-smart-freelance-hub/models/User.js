const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: { type: String, enum: ['Freelancer', 'Client'], required: true },
  profileImage: { type: String },
  skills: [String],
  bio: { type: String },
  location: { type: String },
  contactInfo: {
    phone: String,
    socialLinks: [String],
  },
  ratings: { type: Number, default: 0 },
});

module.exports = mongoose.model('Users', userSchema);
