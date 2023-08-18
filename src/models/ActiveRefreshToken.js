const mongoose = require('mongoose')

const activeRefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    immutable: true,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    immutable: true,
    required: true,
    unique: true
  }, 
})

const ActiveRefreshToken = mongoose.model('ActiveRefreshToken', activeRefreshTokenSchema)

module.exports = {
  activeRefreshTokenSchema,
  ActiveRefreshToken,
}