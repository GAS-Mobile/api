const { AnalysisRequest } = require('../models/AnalysisRequest')
const { Customer } = require('../models/Customer') 
const { Company } = require('../models/Company')
const { Analyst } = require('../models/Analyst') 
const { Analysis } = require('../models/Analysis') 

// Private route for customers
const createAnalysisRequest = async (req, res) => {
  /*
    #swagger.summary = "Private route for customers"
    #swagger.security = []
    #swagger.description = "Creates a new analysis request."
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/analysisRequest"
          }  
        }
      }
    }
    #swagger.responses[201] = {
      content: {
        "application/json": {
          example: {
            message: "Analysis requested successfully"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      content: {
        "application/json": {
          example: {
            message: "To create an analysis request is necessary to send customerID, companyID and motive"
          }
        }
      }           
    }
    #swagger.responses[403] = {
      ifStatusPresent: true,
      content: {
        "application/json": {
          example: {
            responsePossibilities: [
              { message: "You do not have sufficient privileges to access this route" },
              { message: "You do not have the necessary permissions to access this route" }
            ]
          }
        }           
      }
    }
    #swagger.responses[404] = {
      ifStatusPresent: true,
      content: {
        "application/json": {
          example: {
            responsePossibilities: [
              { message: "Customer not found" },
              { message: "Company not found" }
            ]
          }
        }           
      }
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while requesting the analysis"
          }
        }           
      }
    }
  */
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
  /*
    #swagger.summary = "Private route for analysts and customers"
    #swagger.description = "For analysts, lists all analysis requests. In customers case, only lists their analysis requests."
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            analysisRequests: [
              {
                "_id": "64dfe622c212d95c33215769",
                "customer": {
                  "_id": "64dfe17bc22222d9bc31575b",
                  "user": "64d631722bc2d9ba5c315759",
                  "name": "customer",
                  "cpf": "000.000.000-00"
                },
                "company": {
                  "_id": "64dfe6kklkc2d9ba5c315753",
                  "name": "XYZ Enterprises",
                  "industry": "Finance",
                  "cnpj": "00.705.432/0001-02",
                  "headquartersLocation": {
                    "street": "456 Elm Avenue",
                    "city": "Townsville",
                    "state": "Province",
                    "postalCode": "50000-000",
                    "country": "Country",
                    "_id": "64dfe62kjij2d9ba5c315754"
                  }
                },
                "motive": "Lorem",
                "status": "Approved",
                "requestDate": "2023-08-18T21:47:00.881Z"
              },
              {
                "_id": "64dfe622c212d95c33215769",
                "customer": {
                  "_id": "64dfe17bc22222d9bc31575b",
                  "user": "64d631722bc2d9ba5c315759",
                  "name": "customer",
                  "cpf": "000.000.000-00"
                },
                "company": {
                  "_id": "64dfe6kklkc2d9ba5c315753",
                  "name": "XYZ Enterprises",
                  "industry": "Finance",
                  "cnpj": "00.705.432/0001-02",
                  "headquartersLocation": {
                    "street": "456 Elm Avenue",
                    "city": "Townsville",
                    "state": "Province",
                    "postalCode": "50000-000",
                    "country": "Country",
                    "_id": "64dfe62kjij2d9ba5c315754"
                  }
                },
                "motive": "Lorem",
                "status": "Approved",
                "requestDate": "2023-08-18T21:47:00.881Z"
              }
            ]
          }
        }
      }           
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while fetching analysis requests"
          }
        }           
      }
    }
  */
  try {
    const user = req.user
    let analysisRequests = await AnalysisRequest.find()
      .populate('company', '_id name industry cnpj headquartersLocation')
      .populate('customer', '_id user name cpf')
      .select({__v:0})

    if(user.customerID){
      analysisRequests = requests.filter((analysisRequest) => {
        return analysisRequest.customer._id.toString() === user.customerID
      })
    }
      
    res.status(200).json({analysisRequests})
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching analysis requests' })
  }
}

// Private route for analysts and customers
const getAnalysisRequestByID = async (req, res) => {
  /*
    #swagger.summary = "Private route for analysts and customers"
    #swagger.description = "Shows information about one analysis request determined by ID. In the customer case, even if the analysis request exists, it only shows the information if it is his."
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            analysisRequest: {
              "_id": "64dfe622c212d95c33215769",
              "customer": {
                "_id": "64dfe17bc22222d9bc31575b",
                "user": "64d631722bc2d9ba5c315759",
                "name": "customer",
                "cpf": "000.000.000-00"
              },
              "company": {
                "_id": "64dfe6kklkc2d9ba5c315753",
                "name": "XYZ Enterprises",
                "industry": "Finance",
                "cnpj": "00.705.432/0001-02",
                "headquartersLocation": {
                  "street": "456 Elm Avenue",
                  "city": "Townsville",
                  "state": "Province",
                  "postalCode": "50000-000",
                  "country": "Country",
                  "_id": "64dfe62kjij2d9ba5c315754"
                }
              },
              "motive": "Lorem",
              "status": "Approved",
              "requestDate": "2023-08-18T21:47:00.881Z"
            }
          }
        }           
      }
    }
    #swagger.responses[403] = {
      content: {
        "application/json": {
          example: {
            responsePossibilities: [
              { message: "You do not have sufficient privileges to access this route" },
              { message: "You do not have the necessary permissions to access this route" }
            ]        
          }
        }           
      }
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while fetching the analysis request"
          }
        }           
      }
    }
  */
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
    res.status(500).json({ message: 'An error occurred while fetching the analysis request' })
  }
}

// Private route for analysts
const updateAnalysisRequestByID = async (req, res) => {
  /*
    #swagger.summary = "Private route for analysts"
    #swagger.description = "Updates information about one analysis request determined by ID."
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/analysisRequestStatus"
          }  
        }
      }
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            responsePossibilities: [
              { message: "Analysis request updated successfully" },
              { message: "Analysis request updated and analysis created successfully" }
            ]
          }
        }           
      }
    }
    #swagger.responses[400] = {
      content: {
        "application/json": {
          example: {
            message: "Cannot update an analysis request that has already been analyzed"
          }
        }           
      }
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while updating the analysis request"
          }
        }           
      }
    }
  */
  try {
    const analysisRequestID = req.params.id
    const data = req.body.analysisRequest

    if (!data || !data.status){
      return res.status(400).json({ 
        message: 'To update an analysis request a status must be provided' 
      })
    }

    if (!analysisRequestID || analysisRequestID.length !== 24) {
      return res.status(404).json({ message: 'Analysis request not found' })
    }
    
    const analysisRequest = await AnalysisRequest.findById(analysisRequestID)
    if (!analysisRequest) {
      return res.status(404).json({ message: 'Analysis request not found' })
    }

    if (analysisRequest.status !== 'In analysis') {
      return res.status(400).json({ message: 'Cannot update an analysis request that has already been analyzed' });
    }

    analysisRequest.status = data.status
    await analysisRequest.save()

    if (data.status === 'Approved'){
      const randomAnalyst = (await Analyst.aggregate([{ $sample: { size: 1 } }])).at(0)

      await Analysis.create({
        request: analysisRequest._id, 
        analyst: randomAnalyst._id,
      })
      return res.status(200).json({ message: 'Analysis request updated and analysis created successfully' });
    } else {
      res.status(200).json({ message: 'Analysis request updated successfully' })
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the analysis request' })
  }
}

// Private route for analysts and customers
const deleteAnalysisRequestByID = async (req, res) => {
  /*
    #swagger.summary = "Private route for analysts and customers"
    #swagger.description = "Deletes one analysis request determined by ID. In the customer case, even if the analysis request exists, he can only delete if it is his."
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            message: "Analysis request deleted successfully"
          }
        }           
      }
    }
    #swagger.responses[403] = {
      content: {
        "application/json": {
          example: {
            responsePossibilities: [
              { message: "You do not have sufficient privileges to access this route" },
              { message: "You do not have the necessary permissions to access this route" }
            ]        
          }
        }           
      }
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while deleting the analysis request"
          }
        }           
      }
    }
  */
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
    res.status(500).json({ message: 'An error occurred while deleting the analysis request' })
  }
}

module.exports = {
  createAnalysisRequest,
  getAllAnalysisRequests,
  getAnalysisRequestByID,
  updateAnalysisRequestByID,
  deleteAnalysisRequestByID
}
