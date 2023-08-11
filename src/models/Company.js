const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  cnpj: {
    type: String,
    immutable: true,
    unique: true,
    match: /\d{14}/,    
    required: true,
  },
  headquartersLocation: addressSchema,
})

const Company = mongoose.model('Company', companySchema)

module.exports = {
  companySchema,
  Company,
}