const { Company } = require('../models/Company')
const { AnalysisRequest } = require('../models/AnalysisRequest')
const { Analysis } = require('../models/Analysis')
const { formatCNPJ } = require('../utils/formatters')

// Public route
const getAllCompanies = async (req, res) => {
  /*
    #swagger.summary = "Public route"
    #swagger.description = "List all companies."
    #swagger.security = []
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            companies: [
              {
                name: "XYZ Enterprises",
                industry: "Finance",
                cnpj: "00.705.432/0001-02",
                headquartersLocation: {
                  street: "456 Elm Avenue",
                  city: "Townsville",
                  state: "Province",
                  postalCode: "50000-000",
                  country: "Country"
                }
              },
              {
                name: "XYZ Enterprises",
                industry: "Finance",
                cnpj: "12.705.432/0001-02",
                headquartersLocation: {
                  street: "456 Elm Avenue",
                  city: "Townsville",
                  state: "Province",
                  postalCode: "50000-000",
                  country: "Country"
                }
              },
            ],
            "info": {
              "totalPages": 1,
              "currentPage": 1,
              "totalItems": 2,
              "pageSize": 20
            }
          }
        }
      }           
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while fetching companies"
          }
        }           
      }
    }
  */
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const companies = await Company.find()
      .skip((page-1)*limit)
      .limit(limit)
      .select({__v: 0, 'headquartersLocation._id': 0})
      
    const totalItems = await Company.countDocuments()
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      companies: companies,
      info: {
        totalPages: totalPages,
        currentPage: page,
        totalItems: totalItems,
        pageSize: limit,
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching companies' })
  }
}

// Private route for admins
const createCompany = async (req, res) => {
  /*
    #swagger.summary = "Private route for admins"
    #swagger.description = "Creates a new company."
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/company"
          } 
        }
      }
    }
    #swagger.responses[201] = {
      content: {
        "application/json": {
          example: {
            message: "Company created successfully"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      content: {
        "application/json": {
          example: {
            message: "To create a company is necessary to send name, industry, CNPJ and headquartersLocation."
          }
        }
      }           
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while creating the company"
          }
        }           
      }
    }
  */
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
    res.status(500).json({ message: 'An error occurred while creating the company' })
  }
}

// Public route
const getCompanyByID = async (req, res) => {
  /*
    #swagger.summary = "Public route"
    #swagger.description = "Shows information about one company determined by ID."
    #swagger.security = []
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            company: {
              name: "XYZ Enterprises",
              industry: "Finance",
              cnpj: "00.705.432/0001-02",
              headquartersLocation: {
                street: "456 Elm Avenue",
                city: "Townsville",
                state: "Province",
                postalCode: "50000-000",
                country: "Country"
              }
            }
          }  
        }
      }           
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while fetching the company"
          }
        }           
      }
    }
  */
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
    res.status(500).json({ message: 'An error occurred while fetching the company' })
  }
}

// Private route for admins
const updateCompanyByID = async (req, res) => {  
  /*
    #swagger.description = "Updates information about one company determined by ID."
    #swagger.summary = "Private route for admins"
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/company"
          }  
        }
      }
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            message: "Company updated successfully"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      content: {
        "application/json": {
          example: {
            message: "To update a company, at least one field (name, industry, CNPJ, headquartersLocation) must be provided"
          }
        }           
      }
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while updating the company"
          }
        }           
      }
    }
  */
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
    res.status(500).json({ message: 'An error occurred while updating the company' })
  }
}

// Private route for admins
const deleteCompanyByID = async (req, res) => {
  /*
    #swagger.description = "Deletes one company determined by ID."
    #swagger.summary = "Private route for admins"
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            message: "Company deleted successfully"
          }
        }           
      }
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while deleting the company"
          }
        }           
      }
    }
  */
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
    res.status(500).json({ message: 'An error occurred while deleting the company' })
  }
}

// Public route
const searchCompanies = async (req, res) => {
  /*
    #swagger.summary = "Public route"
    #swagger.description = "Search companies by name and CNPJ."
    #swagger.security = []
    #swagger.parameters['sort'] = {
      "in": "query",
      "schema": {
        '@enum': ['asc', 'desc']
      } 
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            companies: [
              {
                name: "XYZ Enterprises",
                industry: "Finance",
                cnpj: "00.705.432/0001-02",
                headquartersLocation: {
                  street: "456 Elm Avenue",
                  city: "Townsville",
                  state: "Province",
                  postalCode: "50000-000",
                  country: "Country"
                }
              },
              {
                name: "XYZ Enterprises",
                industry: "Finance",
                cnpj: "12.705.432/0001-02",
                headquartersLocation: {
                  street: "456 Elm Avenue",
                  city: "Townsville",
                  state: "Province",
                  postalCode: "50000-000",
                  country: "Country"
                }
              },
            ],
            "info": {
              "totalPages": 1,
              "currentPage": 1,
              "totalItems": 2,
              "pageSize": 20
            }
          }
        }
      }           
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while searching companies"
          }
        }           
      }
    }
  */
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const query = req.query.q
    const sort = req.query.sort
    let companies = []
    let databaseQuery = {}
    
    const hasCharsInQuery = query && query.match(/\D/g) && query.match(/\D/g).length > 0
    
    if (query && hasCharsInQuery){
      databaseQuery = {name: { "$regex": query, "$options": "i" }}
    } 
    else if (query && !hasCharsInQuery) {
      databaseQuery = { 
        $or: [
          {name: { "$regex": query, "$options": "i" }},
          {cnpj: { "$regex": "^" + formatCNPJ(query) }}
        ]
      }
    }

    if (sort && (sort === 'asc' || sort === 'desc')) {
      companies = await Company.find(databaseQuery)
      .sort({score: sort})
      .skip((page-1)*limit)
      .limit(limit)
      .select({__v: 0, 'headquartersLocation._id': 0})
    }
    else {
      companies = await Company.find(databaseQuery)
      .skip((page-1)*limit)
      .limit(limit)
      .select({__v: 0, 'headquartersLocation._id': 0})
    }

    const totalItems = await Company.countDocuments(databaseQuery)
    const totalPages = Math.ceil(totalItems / limit)
      
    res.status(200).json({
      companies: companies,
      info: {
        totalPages: totalPages,
        currentPage: page,
        totalItems: totalItems,
        pageSize: limit,
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while searching companies' })
  }
}

// Public route
const getCompanyAnalyzes = async (req, res) => {
  /*
    #swagger.summary = "Public route"
    #swagger.description = "List all analyzes for one company determined by ID."
    #swagger.security = []
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            analyzes: [
              {
                "_id": "64ebd211ae86d702181212db",
                "request": "64ebce672927dsfadfe659b2",
                "analyst": "64ebd1ee826d7bbb1821e96a",
                "firmLevelClaimScore": 2,
                "firmLevelExecutionalScore": 10,
                "ascore": 6,
                "status": "Completed",
                "createdAt": "2023-08-27T22:45:37.231Z",
                "analysisDate": "2023-08-27T22:47:39.311Z"
              }
            ],
            "info": {
              "totalPages": 1,
              "currentPage": 1,
              "totalItems": 1,
              "pageSize": 20
            }
          }
        }
      }           
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while fetching the analyzes"
          }
        }           
      }
    }
  */
  try {
    const companyID = req.params.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    if (!companyID || companyID.length !== 24) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const company = await Company.findById(companyID)
      .select({__v: 0, 'headquartersLocation._id': 0})

    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const databaseQuery = {
      $and: [
        {company: companyID},
        {status: 'Approved'}
      ]
    }
    
    const analysisRequestsForThisCompany = await AnalysisRequest.find(databaseQuery)
      .skip((page-1)*limit)
      .limit(limit)

    const analyzesOfThisCompany = []
    for(let analysisRequest of analysisRequestsForThisCompany){
      let analysis = await Analysis.findOne({ request: analysisRequest._id })
        .select('-__v')
      analyzesOfThisCompany.push(analysis)
    }

    const totalItems = await AnalysisRequest.countDocuments(databaseQuery)
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      analyzes: analyzesOfThisCompany,
      info: {
        totalPages: totalPages,
        currentPage: page,
        totalItems: totalItems,
        pageSize: limit,
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the analyzes' })
  }
}

module.exports = {
  createCompany,
  getAllCompanies,
  searchCompanies,
  getCompanyByID,
  updateCompanyByID,
  deleteCompanyByID,
  getCompanyAnalyzes,
}
