const { Analysis } = require('../models/Analysis')
const { Analyst } = require('../models/Analyst')
const { AnalysisRequest } = require('../models/AnalysisRequest')
// Private route for analysts
const createAnalysis = async (req, res) => {
  try {
    const {requestID} = req.body.analysis

    const analysisRequestExists = await AnalysisRequest.exists({_id: requestID})
    if(!analysisRequestExists){
      return res.status(404).json({ message: 'Analysis request not found' })
    }
    
    const analysisExists = await Analysis.exists({requestID})
    if(analysisExists){
      return res.status(409).json({ message: 'An analysis for this request already exists' })
    }
    
    const randomAnalyst = (await Analyst.aggregate([{ $sample: { size: 1 } }])).at(0)
    const analystCPF = randomAnalyst.cpf
    
    await Analysis.create({requestID, analystCPF})
    res.status(201).json({ message: 'Analysis created successfully' })
    
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the analysis' })
  }
}
// Public route
const getAnalyzes = async (req, res) => {
  try {
    const analyzes = await Analysis.find()
      .select({_id: 1, __v:0})
      
    res.status(200).json({analyzes})

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching analyzes' })
  }
}
// Public route
const getAnalysisByID = async (req, res) => {
  try {
    const analysisID = req.params.id

    if (analysisID.length !== 24) {
      return res.status(404).json({ message: 'Analysis not found' })
    }

    const analysis = await Analysis.findById(analysisID)
      .select({__v: 0, _id: 1})

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' })
    }

    res.status(200).json({ analysis })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// Private route for analysts
const updateAnalysisByID = async (req, res) => {
  try {
    const analysisID = req.params.id
    const data = req.body.analysis

    if (analysisID.length !== 24) {
      return res.status(404).json({ message: 'Analysis not found' })
    }

    const analysis = await Analysis.findById(analysisID)
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' })
    }

    analysis.set(data)
    await analysis.save()
    res.status(200).json({ message: 'Analysis updated successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// Private route for analysts
const deleteAnalysisByID = async (req, res) => {
  try {
    const analysisID = req.params.id

    if (analysisID.length !== 24) {
      return res.status(404).json({ message: 'Analysis not found' })
    }

    const analysisExists = await Analysis.exists({_id: analysisID})
    if (!analysisExists) {
      return res.status(404).json({ message: 'Analysis not found' })
    }

    await Analysis.deleteOne({ _id: analysisID})
    res.status(200).json({ message: 'Analysis deleted successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createAnalysis,
  getAnalyzes,
  getAnalysisByID,
  updateAnalysisByID,
  deleteAnalysisByID
}
