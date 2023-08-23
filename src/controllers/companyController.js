const { Company } = require('../models/Company')

// Public route
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .select({__v: 0, 'headquartersLocation._id': 0})
      
    res.json({companies})

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Private route for admins
const createCompany = async (req, res) => {
  try {
    const data = req.body.company

    if (!data || !data.name || !data.industry || !data.cnpj || !data.headquartersLocation ||
        !data.headquartersLocation.street || !data.headquartersLocation.city || 
        !data.headquartersLocation.state || !data.headquartersLocation.postalCode || 
        !data.headquartersLocation.country
    ){
      return res.status(400).json({ 
        message: 'To create a company is necessary to send name, industry, CNPJ and headquartersLocation.'
      })
    }
    
    const companyExists = await Company.exists({ cnpj: data.cnpj })
    if(companyExists) {
      return res.status(409).json({ message: 'CNPJ is already in use by another company' })
    }

    await Company.create({
      name: data.name,
      industry: data.industry,
      cnpj: data.cnpj,
      headquartersLocation: data.headquartersLocation,
    })

    res.status(201).json({ message: 'Company created successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Public route
const getCompanyByID = async (req, res) => {
  try {
    const companyID = req.params.id

    if (!companyID || companyID.length !== 24) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const company = await Company.findById(companyID)
      .select({__v: 0, 'headquartersLocation._id': 0})

    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    res.status(200).json({company})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Private route for admins
const updateCompanyByID = async (req, res) => {  
  try {
    const companyID = req.params.id
    const data = req.body.company

    if (!data || (!data.name && !data.industry && !data.cnpj && (!data.headquartersLocation 
      || (!data.headquartersLocation.street && !data.headquartersLocation.city &&
      !data.headquartersLocation.state && !data.headquartersLocation.postalCode && 
      !data.headquartersLocation.country)))
    ){
      return res.status(400).json({ 
        message: 'To update a company, at least one field (name, industry, CNPJ, headquartersLocation) must be provided' 
      })
    }

    if (!companyID || companyID.length !== 24) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const company = await Company.findById(companyID)
    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    if (data.cpnj) {
      const companyWithNewCNPJ = await Company.findOne({ cnpj: data.cnpj })
      if (companyWithNewCNPJ && companyWithNewCNPJ._id.toString() !== company._id.toString()) {
        return res.status(409).json({ message: 'CNPJ is already in use by another company' })
      }
    }

    if (data.name) company.name = data.name
    if (data.industry) company.industry = data.industry
    if (data.cnpj) company.cnpj = data.cnpj
    if (data.headquartersLocation) {
      if (data.headquartersLocation.street) company.headquartersLocation.street = data.headquartersLocation.street
      if (data.headquartersLocation.city) company.headquartersLocation.city = data.headquartersLocation.city
      if (data.headquartersLocation.state) company.headquartersLocation.state = data.headquartersLocation.state
      if (data.headquartersLocation.postalCode) company.headquartersLocation.postalCode = data.headquartersLocation.postalCode
      if (data.headquartersLocation.country) company.headquartersLocation.country = data.headquartersLocation.country
    }

    await company.save()

    res.status(200).json({ message: 'Company updated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Private route for admins
const deleteCompanyByID = async (req, res) => {
  try {
    const companyID = req.params.id

    if (!companyID || companyID.length !== 24) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const companyExists = await Company.exists({ _id: companyID })
    if (!companyExists) {
      return res.status(404).json({ message: 'Company not found' })
    }

    await Company.deleteOne({ _id: companyID})
    res.status(200).json({ message: 'Company deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyByID,
  updateCompanyByID,
  deleteCompanyByID,
}
