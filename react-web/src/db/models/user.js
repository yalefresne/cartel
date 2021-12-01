const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  hash: String,
  salt: String,
});

// .save function should be called to persist the changes.
userSchema.methods.setPassword = async function(password) {
  this.salt = await bcrypt.genSalt();
  this.hash = await bcrypt.hash(password, this.salt);
};

userSchema.methods.validatePassword = async function(password) {
  const hash = await bcrypt.hash(password, this.salt);
  return this.hash === hash;
};

userSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 2);

  return jwt.sign({
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, process.env.SECRET);
}

userSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    username: this.username,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model('User', userSchema);