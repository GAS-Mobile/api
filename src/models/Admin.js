const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    immutable: true,
    required: true,
    unique: true
  } 
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = {
  adminSchema,
  Admin,
}