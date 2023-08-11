const mongoose = require('mongoose')

const analysisRequestSchema = new mongoose.Schema({
  customerCPF: {
    type: String,
    immutable: true,
    unique: true,
    match: /\d{11}/,    
    required: true,
  },
  companyCNPJ: {
    type: String,
    immutable: true,
    unique: true,
    match: /\d{14}/,    
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
