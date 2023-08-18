const mongoose = require('mongoose')

const analysisRequestSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
    immutable: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
    immutable: true,
  },
  requestDate: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
    required: true,
  },
  motive: {
    type: String,
    required: true,
    immutable: true
  },
  status: {
    type: String,
    enum: ['In analysis', 'Approved', 'Reproved'],
    required: true,
    default: 'In analysis'
  }
})

const AnalysisRequest = mongoose.model('AnalysisRequest', analysisRequestSchema)

module.exports = {
  analysisRequestSchema,
  AnalysisRequest,
}
