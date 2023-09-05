const { User } = require('../models/User')
const { Analyst } = require('../models/Analyst')
const { Customer } = require('../models/Customer')

// Private route for admins
const createAnalyst = async (req, res) => {
  /*
    #swagger.summary = "Private route for admins"
    #swagger.description = "Creates a new analyst."
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/analyst"
          }  
        }
      }
    }
    #swagger.responses[201] = {
      content: {
        "application/json": {
          example: {
            message: "Analyst created successfully"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      content: {
        "application/json": {
          example: {
            message: "To create an analyst is necessary to send email, password, name and CPF"
          }
        }
      }           
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while creating the analyst"
          }
        }           
      }
    }
  */
  try {
    const data = req.body.analyst

    if (!data || !data.email || !data.password || !data.name || !data.cpf){
      return res.status(400).json({ 
        message: 'To create an analyst is necessary to send email, password, name and CPF'
      })
    }

    const userExists = await User.exists({ email: data.email })
    if (userExists) {
      return res.status(409).json({ message: 'Email is already in use by another user' })
    }

    const customerExists = await Customer.exists({cpf: data.cpf})
    if (customerExists) {
      return res.status(409).json({ message: 'CPF is already in use by another user' })
    }

    const analystExists = await Analyst.exists({cpf: data.cpf})
    if (analystExists) {
      return res.status(409).json({ message: 'CPF is already in use by another user' })
    }
    
    const newUser = await User.create({email: data.email, password: data.password})
    await Analyst.create({
      user: newUser._id,
      name: data.name,
      cpf: data.cpf
    })

    res.status(201).json({ message: 'Analyst created successfully' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the analyst' })
  }
}

// Private route for admins
const getAllAnalysts = async (req, res) => {
  /*
    #swagger.summary = "Private route for admins"
    #swagger.description = "List all analysts."
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            analysts: [
              {
                "_id": "64e681dafsd11f2d381231b9",
                "user": {
                  "_id": "64e68e2lsdakc1d9jj7697dd",
                  "email": "analyst@gmail.com"
                },
                "name": "analyst",
                "cpf": "000.000.000-00"
              },
              {
                "_id": "64e60000fsd11f2d381231b9",
                "user": {
                  "_id": "64e68e2lsda099d9jj7697dd",
                  "email": "analyst2@gmail.com"
                },
                "name": "analyst",
                "cpf": "001.000.000-00"
              }
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
            message: "An error occurred while fetching analysts"
          }
        }           
      }
    }
  */
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const analysts = await Analyst.find()
      .skip((page-1)*limit)
      .limit(limit)
      .populate('user', 'email _id')
      .select({__v: 0})
    
    const totalItems = await Analyst.countDocuments()
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      analysts: analysts,
      info: {
        totalPages: totalPages,
        currentPage: page,
        totalItems: totalItems,
        pageSize: limit,
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching analysts' })
  }
}

// Private route for admins and analysts
const getAnalystByID = async (req, res) => {
  /*
    #swagger.description = "Shows information about one analyst determined by ID."
    #swagger.summary = "Private route for admins and the analyst with the specified ID"
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            analyst: {
              "_id": "64e681dafsd11f2d381231b9",
              "user":{
                "_id": "64e68e2lsdakc1d9jj7697dd",
                "email": "analyst@gmail.com"
              },
              "name": "analyst",
              "cpf": "000.000.000-00"
            },
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
            message: "An error occurred while fetching the analyst"
          }
        }           
      }
    }
  */
  try {
    const analystID = req.params.id
    const user = req.user

    if (user.analystID && user.analystID !== analystID){
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    } else if ((user.analystID && user.analystID !== analystID) && !user.adminID) {
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    }

    if (!analystID || analystID.length !== 24) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    const analyst = await Analyst.findById(analystID)
      .populate('user', 'email _id')
      .select({__v: 0})

    if (!analyst) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    res.status(200).json({ analyst })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the analyst' })
  }
}

// Private route for admins and analysts
const updateAnalystByID = async (req, res) => {
  /*
    #swagger.description = "Updates information about one analyst determined by ID."
    #swagger.summary = "Private route for admins and the analyst with the specified ID"
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/analyst"
          }  
        }
      }
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            message: "Analyst updated successfully"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      content: {
        "application/json": {
          example: {
            message: "To update an analyst, at least one field (email, password, name, cpf) must be provided"
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
            message: "An error occurred while updating the analyst"
          }
        }           
      }
    }
  */
  try {
    const analystID = req.params.id
    const data = req.body.analyst
    const user = req.user

    if (user.analystID && user.analystID !== analystID){
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    } else if ((user.analystID && user.analystID !== analystID) && !user.adminID) {
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    }

    if (!data || (!data.email && !data.password && !data.name && !data.cpf)) {
      return res.status(400).json({ 
        message: 'To update an analyst, at least one field (email, password, name, cpf) must be provided' 
      })
    }

    if (!analystID || analystID.length !== 24) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    const analyst = await Analyst.findById(analystID).populate('user', 'email _id')
    if (!analyst) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    if (data.email) {
      const userWithNewEmail = await User.findOne({ email: data.email })
      if (userWithNewEmail && userWithNewEmail._id.toString() !== analyst.user._id.toString()) {
        return res.status(409).json({ message: 'Email is already in use by another user' })
      }
    }

    if (data.cpf) {
      const customerWithNewCPF = await Customer.findOne({ cpf: data.cpf })
      const analystWithNewCPF = await Analyst.findOne({ cpf: data.cpf })
      if ((analystWithNewCPF && analystWithNewCPF._id.toString() !== analystID) || customerWithNewCPF) {
        return res.status(409).json({ message: 'CPF is already in use by another user' })
      }
    }

    if (data.email) analyst.user.email = data.email
    if (data.password) analyst.user.password = data.password
    if (data.name) analyst.name = data.name
    if (data.cpf) analyst.cpf = data.cpf

    await analyst.save()
    await analyst.user.save()

    res.status(200).json({ message: 'Analyst updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the analyst' })
  }
}

// Private route for admins and analysts
const deleteAnalystByID = async (req, res) => {
  /*
    #swagger.description = "Deletes one analyst determined by ID."
    #swagger.summary = "Private route for admins and the analyst with the specified ID"
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            message: "Analyst deleted successfully"
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
            message: "An error occurred while deleting the analyst"
          }
        }           
      }
    }
  */
  try {
    const analystID = req.params.id
    const user = req.user

    if (user.analystID && user.analystID !== analystID){
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    } else if ((user.analystID && user.analystID !== analystID) && !user.adminID) {
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    }

    if (!analystID || analystID.length !== 24) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    const analyst = await Analyst.findById(analystID)
    if (!analyst) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    await Analyst.deleteOne({ _id: analystID})
    await User.deleteOne({ _id: analyst.user._id})

    res.status(200).json({ message: 'Analyst deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the analyst' })
  }
}

module.exports = {
  createAnalyst,
  getAllAnalysts,
  getAnalystByID,
  updateAnalystByID,
  deleteAnalystByID
}