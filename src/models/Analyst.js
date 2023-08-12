const mongoose = require('mongoose')

const analystSchema = new mongoose.Schema({
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
  }
})

const Analyst = mongoose.model('Analyst', analystSchema)

module.exports = {
  analystSchema,
  Analyst,
}