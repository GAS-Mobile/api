const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const saltRounds = 10

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    match: /^\w[A-Za-z0-9.]+@[A-Za-z0-9.]+\.[A-Za-z0-9.]+$/,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('User', userSchema)

module.exports = {
  userSchema,
  User,
}