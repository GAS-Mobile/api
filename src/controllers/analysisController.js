const { Analysis } = require('../models/Analysis')
const { Analyst } = require('../models/Analyst')
const { AnalysisRequest } = require('../models/AnalysisRequest')

// Private route for analysts
const createAnalysis = async (req, res) => {
  try {
    const data = req.body.analysis
    const user = req.user

    if (!data || !data.requestID){
      return res.status(400).json({ 
        message: 'To create a customer is necessary to send a requestID'
      })
    }

    const analysisRequestExists = await AnalysisRequest.exists({_id: data.requestID})
    if(!analysisRequestExists){
      return res.status(404).json({ message: 'Analysis request not found' })
    }
    
    const analysisExists = await Analysis.exists({request: data.requestID})
    if(analysisExists){
      return res.status(409).json({ message: 'An analysis for this request already exists' })
    }

    await Analysis.create({
      request: data.requestID, 
      analyst: user.analystID,
    })

    res.status(201).json({ message: 'Analysis created successfully' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the analysis' })
  }
}

// Public route
const getAllAnalyzes = async (req, res) => {
  try {
    let analyzes = await Analysis.find()
      .populate({
        path: 'request',
        populate: {
          path: 'company',
          select: '-__v'
        },
        select: '-__v'
      })
      .select({__v:0})
      
    res.status(200).json({analyzes})

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching analyzes' })
  }
}

// Public route
const getAnalysisByID = async (req, res) => {
  try {
    const analysisID = req.params.id

    if (!analysisID || analysisID.length !== 24) {
      return res.status(404).json({ message: 'Analysis not found' })
    }

    const analysis = await Analysis.findById(analysisID)
      .populate({
        path: 'request',
        populate: {
          path: 'company',
          select: '-__v'
        },
        select: '_id customer company'
      })
      .populate({
        path: 'request',
        populate: {
          path: 'customer',
          select: '-__v'
        },
        select: '-__v'
      })
      .select({__v:0})

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
    const user = req.user

    if (!data || (!data.firmLevelClaimScore && !data.firmLevelExecutionalScore && !data.status)) {
      return res.status(400).json({ 
        message: 'To update an analysis, at least one field (firmLevelClaimScore, firmLevelExecutionalScore, status) must be provided' 
      })
    }

    if (!analysisID || analysisID.length !== 24) {
      return res.status(404).json({ message: 'Analysis not found' })
    }

    const analysis = await Analysis.findById(analysisID)
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' })
    }

    if (analysis.analyst._id.toString() !== user.analystID) {
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    }

    if (data.firmLevelClaimScore) analysis.firmLevelClaimScore = data.firmLevelClaimScore
    if (data.firmLevelExecutionalScore) analysis.firmLevelExecutionalScore = data.firmLevelExecutionalScore
    if (data.status) analysis.status = data.status

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
    const user = req.user

    if (!analysisID || analysisID.length !== 24) {
      return res.status(404).json({ message: 'Analysis not found' })
    }

    const analysis = await Analysis.findById(analysisID)
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' })
    }

    if (analysis.analyst._id.toString() !== user.analystID) {
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    }

    await Analysis.deleteOne({ _id: analysisID})
    res.status(200).json({ message: 'Analysis deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createAnalysis,
  getAllAnalyzes,
  getAnalysisByID,
  updateAnalysisByID,
  deleteAnalysisByID
}
