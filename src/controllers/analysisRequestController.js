const { AnalysisRequest } = require('../models/AnalysisRequest')
const { Customer } = require('../models/Customer') 
const { Company } = require('../models/Company')

// Private route for customers
const createAnalysisRequest = async (req, res) => {
  try {
    const data = req.body.analysisRequest

    if (!data || !data.customerID || !data.companyID){
      return res.status(400).json({ 
        message: 'To create an analysis request is necessary to send customerID and companyID'
      })
    }

    const customerExists = await Customer.exists({_id: data.customerID})
    if(!customerExists){
      return res.status(404).json({ message: 'Customer not found' })
    }
    
    const companyExists = await Company.exists({_id: data.companyID})
    if(!companyExists){
      return res.status(404).json({ message: 'Company not found' })
    }

    await AnalysisRequest.create({
      customer: data.customerID,
      company: data.companyID
    })

    res.status(201).json({ message: 'Analysis requested successfully' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while requesting the analysis' })
  }
}

// Private route for analysts and customers
const getAnalysisRequests = async (req, res) => {
  try {
    const requests = await AnalysisRequest.find()
      .populate('company', '_id name industry cnpj headquartersLocation')
      .populate('customer', '_id user name cpf')
      .select({__v:0})
      
    res.status(200).json({requests})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Private route for analysts and customers
const getAnalysisRequestByID = async (req, res) => {
  try {
    const analysisRequestID = req.params.id
    if (!analysisRequestID || analysisRequestID.length !== 24) {
      return res.status(404).json({ message: 'Analysis request not found' })
    }
    
    const analysisRequest = await AnalysisRequest.findById(analysisRequestID)
      .populate('company', '_id name industry cnpj headquartersLocation')
      .populate({
        path: 'customer',
        populate: { 
          path: 'user', 
          select: '_id email '
        },
        select: '_id name cpf user'
      })
      .select({__v:0})

    if (!analysisRequest) {
      return res.status(404).json({ message: 'Analysis request not found' })
    }

    res.status(200).json({analysisRequest})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Private route for analysts and customers
const deleteAnalysisRequestByID = async (req, res) => {
  try {
    const analysisRequestID = req.params.id
    if (!analysisRequestID || analysisRequestID.length !== 24) {
      return res.status(404).json({ message: 'Analysis request not found' })
    }
    
    const analysisRequestExists = await AnalysisRequest.exists({ _id: analysisRequestID })
    if (!analysisRequestExists) {
      return res.status(404).json({ message: 'Analysis request not found' })
    }
    
    await AnalysisRequest.deleteOne({ _id: analysisRequestID})
    res.status(200).json({ message: 'Analysis request deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createAnalysisRequest,
  getAnalysisRequests,
  getAnalysisRequestByID,
  deleteAnalysisRequestByID
}
