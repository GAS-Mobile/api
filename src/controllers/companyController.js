const { Company } = require('../models/Company')
// Public route
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .select({__v: 0, _id: 0, 'headquartersLocation._id': 0})
      
    res.json({companies})

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// Private route for ????
const createCompany = async (req, res) => {
  try {
    const data = req.body.company
    
    const companyExists = await Company.exists({ cnpj: data.cnpj })
    if(companyExists) {
      return res.status(409).json({ message: 'Company already exists' })
    }

    await Company.create(data)
    res.status(201).json({ message: 'Company created successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// Public route
const getCompanyByID = async (req, res) => {
  try {
    const companyID = req.params.id

    if (companyID.length !== 24) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const company = await Company.findById(companyID)
      .select({__v: 0, _id: 0, 'headquartersLocation._id': 0})

    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    res.status(200).json({company})

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// Private route for analysts
const updateCompanyByID = async (req, res) => {
  try {
    const companyID = req.params.id
    const data = req.body.company

    if (companyID.length !== 24) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const company = await Company.findById(companyID)

    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    company.set(data)
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

    if (companyID.length !== 24) {
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
