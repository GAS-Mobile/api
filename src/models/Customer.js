const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    immutable: true,
    unique: true,
    match: /\d{11}/,    
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

const Customer = mongoose.model('Customer', customerSchema)

module.exports = {
  customerSchema,
  Customer,
}