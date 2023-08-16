const { AnalysisRequest } = require('../models/AnalysisRequest')
const { Customer } = require('../models/Customer') 
const { Company } = require('../models/Company')
// Private route for customers
const createAnalysisRequest = async (req, res) => {
  try {
    const { customerCPF, companyCNPJ } = req.body.analysisRequest

    const customerExists = await Customer.exists({cpf: customerCPF})
    if(!customerExists){
      return res.status(404).json({ message: 'Customer not found' })
    }
    
    const companyExists = await Company.exists({cnpj: companyCNPJ})
    if(!companyExists){
      return res.status(404).json({ message: 'Company not found' })
    }

    await AnalysisRequest.create({companyCNPJ, customerCPF})
    res.status(201).json({ message: 'Analysis requested successfully' })
    
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while requesting the analysis' })
  }
}
// Private route for analysts and customers
const getAnalysisRequests = async (req, res) => {
  try {
    const requests = await AnalysisRequest.find()
      .select({_id: 1, __v:0})

    res.status(200).json({requests})

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// Private route for analysts and customers
const getAnalysisRequestByID = async (req, res) => {
  try {
    const analysisRequestID = req.params.id
    if (analysisRequestID.length !== 24) {
      return res.status(404).json({ message: 'Analysis request not found' })
    }
    
    const analysisRequest = await AnalysisRequest.findById(analysisRequestID)
      .select({_id: 1, __v:0})

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
    if (analysisRequestID.length !== 24) {
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
