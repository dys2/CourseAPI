const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  picture: {
    type: String,
    default: 'https://support.plymouth.edu/kb_images/Yammer/default.jpeg'
  }
});


// UserSchema.pre('save', async function(next) {
//   if (!this.isModified("password"))
//     return next();
//   try {
//     this.password = await bcrypt.hash(this.password, 11);
//     next();
//   } catch(err) {
//     next(err);
//   }
// });

UserSchema.methods.passwordIsValid = async function(password, cb) {
  try {
    cb(null, await bcrypt.compare(password, this.password));
  } catch(err) {
    cb(err);
  }
}


module.exports = mongoose.model('User', UserSchema);
