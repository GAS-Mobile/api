const { User } = require('../models/User')
const { Customer } = require('../models/Customer')
const { Analyst } = require('../models/Analyst')

// Private route for admins
const getAllCustomers = async (req, res) => {
  /*
    #swagger.summary = "Private route for admins"
    #swagger.description = "List all customers."
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            customers: [
              {
                "_id": "64e681dafsd11f2d381231b9",
                "user": {
                  "_id": "64e68e2lsdakc1d9jj7697dd",
                  "email": "customer@gmail.com"
                },
                "name": "customer",
                "cpf": "000.000.000-00"
              },
              {
                "_id": "64e60000fsd11f2d381231b9",
                "user": {
                  "_id": "64e68e2lsda099d9jj7697dd",
                  "email": "customer2@gmail.com"
                },
                "name": "customer",
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
            message: "An error occurred while fetching customers"
          }
        }           
      }
    }
  */
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    
    const customers = await Customer.find()
      .skip((page-1)*limit)
      .limit(limit)
      .populate('user', 'email _id')
      .select({__v: 0})

    const totalItems = await Customer.countDocuments()
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      customers: customers,
      info: {
        totalPages: totalPages,
        currentPage: page,
        totalItems: totalItems,
        pageSize: limit,
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching customers' })
  }
}

// Public route
const createCustomer = async (req, res) => {
  /*
    #swagger.summary = "Public route"
    #swagger.security = []
    #swagger.description = "Creates a new customer."
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/customer"
          }  
        }
      }
    }
    #swagger.responses[201] = {
      content: {
        "application/json": {
          example: {
            message: "Customer created successfully"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      content: {
        "application/json": {
          example: {
            message: "To create a customer is necessary to send email, password, name and CPF"
          }
        }
      }           
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while creating the customer"
          }
        }           
      }
    }
  */
  try {
    const data = req.body.customer

    if (!data || !data.email || !data.password || !data.name || !data.cpf){
      return res.status(400).json({ 
        message: 'To create a customer is necessary to send email, password, name and CPF'
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
    await Customer.create({
      user: newUser._id,
      name: data.name,
      cpf: data.cpf
    })

    res.status(201).json({ message: 'Customer created successfully' })

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the customer' })
  }
}

// Private route for customers
const getCustomerByID = async (req, res) => {
  /*
    #swagger.description = "Shows information about one customer determined by ID."
    #swagger.summary = "Private route for the customer with the specified ID"
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            customer: {
              "_id": "64e681dafsd11f2d381231b9",
              "user":{
                "_id": "64e68e2lsdakc1d9jj7697dd",
                "email": "customer@gmail.com"
              },
              "name": "customer",
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
            message: "An error occurred while fetching the customer"
          }
        }           
      }
    }
  */
  try {
    const customerID = req.params.id
    const user = req.user
    
    if (user.customerID !== customerID){
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    }

    if (!customerID || customerID.length !== 24) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    const customer = await Customer.findById(customerID)
      .populate('user', 'email _id')
      .select({__v: 0})

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    res.status(200).json({customer})
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the customer' })
  }
}

// Private route for customers
const updateCustomerByID = async (req, res) => {
  /*
    #swagger.description = "Updates information about one customer determined by ID."
    #swagger.summary = "Private route for the customer with the specified ID"
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/customer"
          }  
        }
      }
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            message: "Customer updated successfully"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      content: {
        "application/json": {
          example: {
            message: "To update a customer, at least one field (email, password, name, cpf) must be provided"
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
            message: "An error occurred while updating the customer"
          }
        }           
      }
    }
  */
  try {
    const customerID = req.params.id
    const data = req.body.customer
    const user = req.user
    
    if (user.customerID !== customerID){
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    }

    if (!data || (!data.email && !data.password && !data.name && !data.cpf)) {
      return res.status(400).json({ 
        message: 'To update a customer, at least one field (email, password, name, cpf) must be provided' 
      })
    }

    if (!customerID || customerID.length !== 24) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    const customer = await Customer.findById(customerID).populate('user', 'email _id')
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    if (data.email) {
      const userWithNewEmail = await User.findOne({ email: data.email })
      if (userWithNewEmail && userWithNewEmail._id.toString() !== customer.user._id.toString()) {
        return res.status(409).json({ message: 'Email is already in use by another user' })
      }
    }

    if (data.cpf) {
      const customerWithNewCPF = await Customer.findOne({ cpf: data.cpf })
      const analystWithNewCPF = await Analyst.findOne({ cpf: data.cpf })
      if ((customerWithNewCPF && customerWithNewCPF._id.toString() !== customerID) || analystWithNewCPF) {
        return res.status(409).json({ message: 'CPF is already in use by another user' })
      }
    }

    if (data.email) customer.user.email = data.email
    if (data.password) customer.user.password = data.password
    if (data.name) customer.name = data.name
    if (data.cpf) customer.cpf = data.cpf

    await customer.save()
    await customer.user.save()

    res.status(200).json({ message: 'Customer updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the customer' })
  }
}

// Private route for customers
const deleteCustomerByID = async (req, res) => {
  /*
    #swagger.description = "Deletes one customer determined by ID."
    #swagger.summary = "Private route for the customer with the specified ID"
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            message: "Customer deleted successfully"
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
            message: "An error occurred while deleting the customer"
          }
        }           
      }
    }
  */
  try {
    const customerID = req.params.id
    const user = req.user
    
    if (user.customerID !== customerID){
      return res.status(403).json({message: 'You do not have the necessary permissions to access this route'})
    }

    if (!customerID || customerID.length !== 24) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    const customer = await Customer.findById(customerID)
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    await Customer.deleteOne({ _id: customerID})
    await User.deleteOne({ _id: customer.user._id})

    res.status(200).json({ message: 'Customer deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the customer' })
  }
}

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerByID,
  updateCustomerByID,
  deleteCustomerByID
}
