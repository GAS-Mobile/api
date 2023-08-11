const mongoose = require('mongoose')

const analysisSchema = new mongoose.Schema({
  requestID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  analystCPF: {
    type: String,
    immutable: true,
    unique: true,
    match: /\d{11}/,    
    required: true,
  },
  firmLevelClaimScore: {
    type: Number,
    required: true,
  },
  firmLevelExecutionalScore: {
    type: Number,
    required: true,
  },
  ascore: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    required: true,
  },
  analysisDate: {
    type: Date,
    required: true,
  }
})

const Analysis = mongoose.model('Analysis', analysisSchema)

module.exports = {
  analysisSchema,
  Analysis,
}