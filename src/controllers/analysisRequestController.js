const { AnalysisRequest } = require('../models/AnalysisRequest')
const { Customer } = require('../models/Customer') 
const { Company } = require('../models/Company')

// Private route for customers
const createAnalysisRequest = async (req, res) => {
  try {
    const data = req.body.analysisRequest
    const user = req.user

    if (!data || !data.customerID || !data.companyID || !data.motive){
      return res.status(400).json({ 
        message: 'To create an analysis request is necessary to send customerID, companyID and motive'
      })
    }

    const customerExists = await Customer.exists({_id: data.customerID})
    if(!customerExists){
      return res.status(404).json({ message: 'Customer not found' })
    }

    if(user.customerID !== data.customerID){
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    }
    
    const companyExists = await Company.exists({_id: data.companyID})
    if(!companyExists){
      return res.status(404).json({ message: 'Company not found' })
    }

    await AnalysisRequest.create({
      customer: data.customerID,
      company: data.companyID,
      motive: data.motive
    })

    res.status(201).json({ message: 'Analysis requested successfully' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while requesting the analysis' })
  }
}

// Private route for analysts and customers
const getAllAnalysisRequests = async (req, res) => {
  try {
    const user = req.user
    let requests = await AnalysisRequest.find()
      .populate('company', '_id name industry cnpj headquartersLocation')
      .populate('customer', '_id user name cpf')
      .select({__v:0})

    if(user.customerID){
      requests = requests.filter((analysisRequest) => {
        return analysisRequest.customer._id.toString() === user.customerID
      })
    }
      
    res.status(200).json({requests})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Private route for analysts and customers
const getAnalysisRequestByID = async (req, res) => {
  try {
    const user = req.user
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

    if(user.customerID && analysisRequest.customer._id.toString() !== user.customerID){
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    }

    res.status(200).json({analysisRequest})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Private route for analysts and customers
const deleteAnalysisRequestByID = async (req, res) => {
  try {
    const user = req.user
    const analysisRequestID = req.params.id
    if (!analysisRequestID || analysisRequestID.length !== 24) {
      return res.status(404).json({ message: 'Analysis request not found' })
    }
    
    const analysisRequest = await AnalysisRequest.findById(analysisRequestID)
    if (!analysisRequest) {
      return res.status(404).json({ message: 'Analysis request not found' })
    }

    if(user.customerID && analysisRequest.customer._id.toString() !== user.customerID){
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    }
    
    await AnalysisRequest.deleteOne({ _id: analysisRequestID})
    res.status(200).json({ message: 'Analysis request deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createAnalysisRequest,
  getAllAnalysisRequests,
  getAnalysisRequestByID,
  deleteAnalysisRequestByID
}
