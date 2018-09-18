const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  contentCreator: {
    type: Boolean,
    default: false
  },
  admin: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now()
  },
  picture: {
    type: String,
    default: 'https://support.plymouth.edu/kb_images/Yammer/default.jpeg'
  },
  verified: {
    type: Boolean,
    default: false
  }
});


userSchema.pre('save', async function(next) {
  if (!this.isModified("password"))
    return next();
  try {
    this.password = await bcrypt.hash(this.password, 11);
    next();
  } catch(err) {
    next(err);
  }
});

userSchema.methods.verifyPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch(err) {
    throw err;
  }
}


module.exports = mongoose.model('User', userSchema);
