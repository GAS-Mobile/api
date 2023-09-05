const { Analysis } = require('../models/Analysis')

// Public route
const getAllAnalyzes = async (req, res) => {
  /*
    #swagger.summary = "Public route"
    #swagger.description = "List all analyzes."
    #swagger.security = []
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            analyzes: [
              {
                "_id": "64dfe7a07bc2d9ba5c315790",
                "request": {
                  "_id": "64dfe6d47bc2d9ba5c315769",
                  "customer": "64dfe6317bc2d9ba5c31575b",
                  "company": {
                    "_id": "64dfe6267bc2d9ba5c315753",
                    "name": "XYZ Enterprises",
                    "industry": "Finance",
                    "cnpj": "00.705.432/0001-02",
                    "score": 0,
                    "headquartersLocation": {
                      "street": "456 Elm Avenue",
                      "city": "Townsville",
                      "state": "Province",
                      "postalCode": "50000-000",
                      "country": "Country",
                      "_id": "64dfe6267bc2d9ba5c315754"
                    }
                  },
                  "motive": "Lorem",
                  "status": "Approved",
                  "requestDate": "2023-08-18T21:47:00.881Z"
                },
                "analyst": "64dfe75d7bc2d9ba5c315780",
                "firmLevelClaimScore": 0,
                "firmLevelExecutionalScore": 0,
                "ascore": 0,
                "status": "Assigned",
                "createdAt": "2023-08-18T21:50:24.770Z",
                "analysisDate": "2023-08-18T21:50:24.770Z"
              },
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
            message: "An error occurred while fetching analyzes"
          }
        }           
      }
    }
  */
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const analyzes = await Analysis.find()
      .populate({
        path: 'request',
        populate: {
          path: 'company',
          select: '-__v'
        },
        select: '-__v'
      })
      .sort({analysisDate: -1})
      .skip((page-1)*limit)
      .limit(limit)
      .select({__v:0})
      
    const totalItems = await Analysis.countDocuments()
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      analyzes: analyzes,
      info: {
        totalPages: totalPages,
        currentPage: page,
        totalItems: totalItems,
        pageSize: limit,
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching analyzes' })
  }
}

// Public route
const getAnalysisByID = async (req, res) => {
  /*
    #swagger.summary = "Public route"
    #swagger.description = "Shows information about one analysis determined by ID."
    #swagger.security = []
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            "analysis": {
              "_id": "64dfe7a07bc2d9ba5c315790",
              "request": {
                "_id": "64dfe6d47bc2d9ba5c315769",
                "customer": "64dfe6317bc2d9ba5c31575b",
                "company": {
                  "_id": "64dfe6267bc2d9ba5c315753",
                  "name": "XYZ Enterprises",
                  "industry": "Finance",
                  "cnpj": "00.705.432/0001-02",
                  "score": 0,
                  "headquartersLocation": {
                    "street": "456 Elm Avenue",
                    "city": "Townsville",
                    "state": "Province",
                    "postalCode": "50000-000",
                    "country": "Country",
                    "_id": "64dfe6267bc2d9ba5c315754"
                  }
                },
                "motive": "Lorem",
                "status": "Approved",
                "requestDate": "2023-08-18T21:47:00.881Z"
              },
              "analyst": "64dfe75d7bc2d9ba5c315780",
              "firmLevelClaimScore": 0,
              "firmLevelExecutionalScore": 0,
              "ascore": 0,
              "status": "Assigned",
              "createdAt": "2023-08-18T21:50:24.770Z",
              "analysisDate": "2023-08-18T21:50:24.770Z"
            }
          }
        }
      }           
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while fetching the analysis"
          }
        }           
      }
    }
  */
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
    res.status(500).json({ message: 'An error occurred while fetching the analysis' })
  }
}

// Private route for analysts
const updateAnalysisByID = async (req, res) => {
  /*
    #swagger.summary = "Private route for analysts"
    #swagger.description = "Updates information about one analysis determined by ID. 
                            Requires the analyst logged in to be the one in charge of the analysis.
                            If any of the scores of the analysis is updated, the score of the company analyzed will also be updated."
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/analysis"
          }  
        }
      }
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            message: "Analysis updated successfully"
          }          
        }
      }
    }
    #swagger.responses[400] = {
      content: {
        "application/json": {
          example: {
            message: "To update an analysis, at least one field (firmLevelClaimScore, firmLevelExecutionalScore, status) must be provided"
          }          
        }
      }
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while updating the analysis"
          }
        }           
      }
    }
  */
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
      .populate({
        path: 'request',
        populate: {
          path: 'company',
          select: '-__v'
        },
        select: '-__v'
      })
    
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
    if (data.firmLevelClaimScore || data.firmLevelExecutionalScore){
      analysis.request.company.score = analysis.ascore
      await analysis.request.company.save()
    }
    
    res.status(200).json({ message: 'Analysis updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the analysis' })
  }
}

// Private route for analysts
const deleteAnalysisByID = async (req, res) => {
  /*
    #swagger.summary = "Private route for analysts"
    #swagger.description = "Deletes one analysis determined by ID. Requires the analyst logged in to be the one in charge of the analysis."
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            message: "Analysis deleted successfully"
          }          
        }
      }
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while deleting the analysis"
          }
        }           
      }
    }
  */
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
    res.status(500).json({ message: 'An error occurred while deleting the analysis' })
  }
}

module.exports = {
  getAllAnalyzes,
  getAnalysisByID,
  updateAnalysisByID,
  deleteAnalysisByID
}
