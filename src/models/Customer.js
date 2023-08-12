const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const saltRounds = 10

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    immutable: true,
    unique: true,
    match: /\d{3}\.\d{3}\.\d{3}-\d{2}/,
    required: true,
  },
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

customerSchema.pre('save', async function(next) {
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

const Customer = mongoose.model('Customer', customerSchema)

module.exports = {
  customerSchema,
  Customer,
}