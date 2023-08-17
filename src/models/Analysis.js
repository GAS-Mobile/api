const mongoose = require('mongoose')

const analysisSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'AnalysisRequest',
    unique: true,
    immutable: true
  },
  analyst: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Analyst',
    immutable: true,
  },
  firmLevelClaimScore: {
    type: Number,
    required: true,
    default: 0,
  },
  firmLevelExecutionalScore: {
    type: Number,
    required: true,
    default: 0,
  },
  ascore: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Assigned', 'In Progress', 'Completed'],
    required: true,
    default: 'Assigned'
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
    required: true,
  },
  analysisDate: {
    type: Date,
    default: () => Date.now(),
    required: true,
  }
})

analysisSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'Completed') {
    this.analysisDate = Date.now()
  }

  if (this.isModified('firmLevelExecutionalScore') || 
    this.isModified('firmLevelClaimScore')) {
    this.ascore = (this.firmLevelExecutionalScore + this.firmLevelClaimScore) / 2
  }

  next()
})

const Analysis = mongoose.model('Analysis', analysisSchema, 'analyzes')

module.exports = {
  analysisSchema,
  Analysis,
}