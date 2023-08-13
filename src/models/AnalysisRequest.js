const mongoose = require('mongoose')

const analysisRequestSchema = new mongoose.Schema({
  customerCPF: {
    type: String,
    immutable: true,
    match: /\d{3}\.\d{3}\.\d{3}-\d{2}/,
    required: true,
  },
  companyCNPJ: {
    type: String,
    immutable: true,
    match: /\d{2}\.\d{3}\.\d{3}\/(0001|0002)-\d{2}/,    
    required: true,
  },
  requestDate: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
    required: true,
  },
})

const AnalysisRequest = mongoose.model('AnalysisRequest', analysisRequestSchema)

module.exports = {
  analysisRequestSchema,
  AnalysisRequest,
}
