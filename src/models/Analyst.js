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
    match: /\d{11}/,    
    required: true,
  }
})

const Analyst = mongoose.model('Analyst', analystSchema)

module.exports = {
  analystSchema,
  Analyst,
}