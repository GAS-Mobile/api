const { User } = require('../models/User')
const { Admin } = require('../models/Admin')
const { paginate } = require('../utils/pagination')

// Private route for admins
const createAdmin = async (req, res) => {
  /*
    #swagger.description = "Creates a new admin."
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/admin"
          }  
        }
      }
    }
    #swagger.responses[201] = {
      content: {
        "application/json": {
          example: {
            message: "Admin created successfully"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      content: {
        "application/json": {
          example: {
            message: "To create an admin is necessary to send email and password"
          }
        }
      }           
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while creating the admin"
          }
        }           
      }
    }
  */
  try {
    const data = req.body.admin

    if (!data || !data.email || !data.password){
      return res.status(400).json({ 
        message: 'To create an admin is necessary to send email and password'
      })
    }

    const userExists = await User.exists({ email: data.email })
    if (userExists) {
      return res.status(409).json({ message: 'Email is already in use by another user' })
    }
    
    const newUser = await User.create({email: data.email, password: data.password})
    await Admin.create({
      user: newUser._id,
    })

    res.status(201).json({ message: 'Admin created successfully' })

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the admin' })
  }
}

// Private route for admins
const getAllAdmins = async (req, res) => {
  /*
    #swagger.description = "List all admins."
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            totalPages: 1,
            admins: [
              {
                "_id": "64e681dafsd11f2d381231b9",
                "user": {
                  "_id": "64e68e2lsdakc1d9jj7697dd",
                  "email": "admin1@gmail.com"
                }
              },
              {
                "_id": "64e681252bddef2d381231b9",
                "user": {
                  "_id": "64e68e2lsdakc182fc7697dd",
                  "email": "admin2@gmail.com"
                }
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
            message: "An error occurred while fetching admins"
          }
        }           
      }
    }
  */
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const admins = await Admin.find()
      .populate('user', 'email _id')
      .select({__v: 0})

    const data = paginate(page, limit, admins)
    res.status(200).json({
      totalPages: data.totalPages,
      admins: data.paginatedItems
    })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching admins' })
  }
}

// Private route for admins
const getAdminByID = async (req, res) => {
  /*
    #swagger.description = "Shows information about one admin determined by ID."
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            admin: {
              "_id": "64e681dafsd11f2d381231b9",
              "user": {
                "_id": "64e68e2lsdakc1d9jj7697dd",
                "email": "admin1@gmail.com"
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
            message: "An error occurred while fetching the admin"
          }
        }           
      }
    }
  */
  try {
    const adminID = req.params.id

    if (!adminID || adminID.length !== 24) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    const admin = await Admin.findById(adminID)
      .populate('user', 'email _id')
      .select({__v: 0})

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    res.status(200).json({admin})
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the admin" })
  }
}

// Private route for admins
const updateAdminByID = async (req, res) => {
  /*
    #swagger.description = "Update information about one admin determined by ID."
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/admin"
          }  
        }
      }
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            message: "Admin updated successfully"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      content: {
        "application/json": {
          example: {
            message: "To update an admin, at least one field (email, password) must be provided"
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
          },
        }           
      }
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while updating the admin"
          }
        }           
      }
    }
  */
  try {
    const adminID = req.params.id
    const data = req.body.admin
    const user = req.user
    
    if (user.adminID !== adminID){
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    }

    if (!data || (!data.email && !data.password)) {
      return res.status(400).json({ 
        message: 'To update an admin, at least one field (email, password) must be provided' 
      })
    }

    if (!adminID || adminID.length !== 24) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    const admin = await Admin.findById(adminID).populate('user', 'email _id')
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    if (data.email) {
      const userWithNewEmail = await User.findOne({ email: data.email })
      if (userWithNewEmail && userWithNewEmail._id.toString() !== admin.user._id.toString()) {
        return res.status(409).json({ message: 'Email is already in use by another user' })
      }
    }

    if (data.email) admin.user.email = data.email
    if (data.password) admin.user.password = data.password

    await admin.user.save()

    res.status(200).json({ message: 'Admin updated successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred while updating the admin' })
  }
}

// Private route for admins
const deleteAdminByID = async (req, res) => {
  /*
    #swagger.description = "Deletes one admin determined by ID."
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            message: "Admin deleted successfully"
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
          },
        }           
      }
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while deleting the admin"
          }
        }           
      }
    }
  */
  try {
    const adminID = req.params.id
    const user = req.user
    
    if (user.adminID !== adminID){
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    }

    if (!adminID || adminID.length !== 24) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    const admin = await Admin.findById(adminID)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    await Admin.deleteOne({ _id: adminID})
    await User.deleteOne({ _id: admin.user._id})

    res.status(200).json({ message: 'Admin deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: "An error occurred while deleting the admin" })
  }
}

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminByID,
  updateAdminByID,
  deleteAdminByID
}
