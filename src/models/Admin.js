const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const saltRounds = 10

const adminSchema = new mongoose.Schema({
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

adminSchema.pre('save', async function(next) {
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

const Admin = mongoose.model('Admin', adminSchema)

module.exports = {
  adminSchema,
  Admin,
}